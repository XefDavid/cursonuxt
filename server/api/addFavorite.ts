import { PrismaClient } from '@prisma/client';
import { defineEventHandler, readBody } from 'h3';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const { userId, title } = await readBody(event);

  console.log("Received data:", { userId, title });

  try {
    // Verificar si el usuario existe en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { message: `Error: User with ID ${userId} not found` };
    }

    // Buscar la película por título
    let movie = await prisma.movie.findUnique({
      where: { title },
    });

    // Si la película no existe, crearla
    if (!movie) {
      movie = await prisma.movie.create({
        data: { title },
      });
      console.log("Movie created:", movie);
    } else {
      console.log("Movie found:", movie);
    }

    // Verificar si el usuario ya tiene esta película como favorita
    const existingFavorite = await prisma.userMovie.findFirst({
      where: { userId, movieId: movie.id },
    });

    if (existingFavorite) {
      return { message: "Movie already in favorites" };
    }

    // Añadir la película a los favoritos
    await prisma.userMovie.create({
      data: {
        userId,
        movieId: movie.id,
      },
    });

    return { message: "Movie added to favorites!" };
  } catch (error) {
    console.error("Error adding favorite:", error);
    return { message: "Error adding favorite", error };
  }
});
