import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret_key_for_jwt";

export default defineEventHandler(async (event) => {
  const { name, profilePic, description, favoriteMovies } = await readBody(event);

  console.log("Datos recibidos del frontend:", {
    name,
    profilePic,
    description,
    favoriteMovies,
  });

  // Obtener y verificar el token
  const token = getHeader(event, "authorization")?.split(" ")[1];
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: "Token is missing",
    });
  }

  try {
    // Decodificar el token JWT
    const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
    console.log("Token decodificado:", decoded);

    // Verificar que el usuario exista
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    // Actualizar los campos básicos del usuario
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        name: name ?? user.name,
        profilePic: profilePic ?? user.profilePic,
        description: description ?? user.description,
      },
    });

    // Si se proporcionan películas favoritas, procesar la relación
    if (favoriteMovies && favoriteMovies.length > 0) {
      // Obtener IDs de las películas a partir de sus títulos
      const movieIds = await prisma.movie.findMany({
        where: {
          title: { in: favoriteMovies }, // Busca películas por título
        },
        select: { id: true },
      });

      console.log("IDs de películas encontradas:", movieIds);

      // Gestionar manualmente las relaciones con películas favoritas
      await prisma.userMovie.deleteMany({
        where: { userId: decoded.id },
      });

      if (movieIds.length > 0) {
        await prisma.userMovie.createMany({
          data: movieIds.map((movie) => ({
            userId: decoded.id,
            movieId: movie.id,
          })),
        });
      }
    } else {
      console.log("No se proporcionaron películas favoritas para actualizar.");
    }

    console.log("Usuario actualizado con éxito:", updatedUser);

    // Devolver la respuesta
    return {
      statusCode: 200,
      body: {
        id: updatedUser.id,
        name: updatedUser.name,
        profilePic: updatedUser.profilePic,
        description: updatedUser.description,
        favoriteMovies: favoriteMovies || [],
      },
    };
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
