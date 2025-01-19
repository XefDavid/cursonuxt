import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret_key_for_jwt";

export default defineEventHandler(async (event) => {
  console.log("Iniciando `user.get` handler");

  const token = getHeader(event, "authorization")?.split(" ")[1];
  console.log("Token recibido:", token);

  if (!token) {
    console.error("Error: No token provided");
    throw createError({
      statusCode: 401,
      statusMessage: "No token provided",
    });
  }

  try {
    const decodedToken: any = jwt.verify(token, SECRET_KEY);
    const userId = decodedToken.id;
    console.log("Token decodificado, userId:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        favoriteMovies: { include: { movie: true } },
      },
    });

    if (!user) {
      console.error("Error: User not found");
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    console.log("Usuario encontrado:", user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      description: user.description,
      profilePic: user.profilePic,
      posts: user.posts,
      favoriteMovies: user.favoriteMovies.map((fav) => fav.movie),
    };
  } catch (error) {
    console.error("Error al obtener el usuario:", error.message);
    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
