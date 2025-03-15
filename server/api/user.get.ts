import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret_key_for_jwt";

export default defineEventHandler(async (event) => {
  try {
    const authHeader = getRequestHeader(event, "authorization");
    if (!authHeader) {
      throw createError({ statusCode: 401, statusMessage: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY) as { id: number };
    const userId = decodedToken.id;

    if (!userId) {
      throw createError({ statusCode: 400, statusMessage: "Invalid token" });
    }

    // Obtener datos del usuario autenticado
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: true,
        favoriteMovies: { include: { movie: true } },
      },
    });

    if (!user) {
      throw createError({ statusCode: 404, statusMessage: "User not found" });
    }

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
    throw createError({ statusCode: 500, statusMessage: "Internal server error" });
  }
});
