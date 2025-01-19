import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  const token = getHeader(event, "authorization")?.split(" ")[1];
  const { title, content } = await readBody(event);

  if (!token) {
    throw createError({ statusCode: 401, statusMessage: "No token provided" });
  }

  try {
    const secretKey = "secret_key_for_jwt"; // Mover a variables de entorno
    const decodedToken: any = jwt.verify(token, secretKey);
    const userId = decodedToken.id;

    const post = await prisma.post.create({
      data: {
        title,
        content,
        userId,
      },
    });

    return { message: "Post created successfully", post };
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: error.message });
  }
});
