import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "authorization")?.split(" ")[1];
  const { movieId } = await readBody(event);

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "No token provided" });
  }

  try {
    const secretKey = "secret_key_for_jwt"; // Mover a variables de entorno
    const decodedToken: any = jwt.verify(token, secretKey);
    const userId = decodedToken.id;

    // Verificar si ya existe la relación
    const existingFavorite = await prisma.userMovie.findUnique({
      where: { userId_movieId: { userId, movieId } },
    });

    if (existingFavorite) {
      throw createError({
        statusCode: 400,
        statusMessage: "Movie already added to favorites",
      });
    }

    // Crear la relación
    const favorite = await prisma.userMovie.create({
      data: {
        userId,
        movieId,
      },
    });

    return { message: "Movie added to favorites", favorite };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
