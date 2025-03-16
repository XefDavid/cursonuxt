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

    const body = await readBody(event);
    if (!body.content || !body.postId) {
      throw createError({ statusCode: 400, statusMessage: "Content y postId son requeridos" });
    }

    const newComment = await prisma.comment.create({
      data: {
        content: body.content,
        postId: body.postId,
        userId,
      },
    });

    return newComment;
  } catch (error) {
    console.error("Error al crear comentario:", error);
    throw createError({ statusCode: 500, statusMessage: "Error creando comentario" });
  }
});
