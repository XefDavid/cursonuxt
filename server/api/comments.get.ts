import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const postId = parseInt(query.postId as string);

  if (!postId) {
    throw createError({ statusCode: 400, statusMessage: "Post ID requerido" });
  }

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: { user: { select: { id: true, name: true, profilePic: true } } },
      orderBy: { createdAt: "desc" },
    });

    return comments;
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    throw createError({ statusCode: 500, statusMessage: "Error obteniendo comentarios" });
  }
});
