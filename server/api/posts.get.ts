import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { id: true, name: true, profilePic: true } }, // Trae datos del usuario
      },
      orderBy: { createdAt: "desc" }, // Ordenar por fecha de creación (más recientes primero)
    });

    return posts;
  } catch (error) {
    console.error("Error al obtener los posts:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error obteniendo posts",
    });
  }
});
