import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret_key_for_jwt";

export default defineEventHandler(async (event) => {
  try {
    // Obtener el token del header
    const authHeader = getRequestHeader(event, "authorization");
    if (!authHeader) {
      console.error("Error: No token provided");
      throw createError({ statusCode: 401, statusMessage: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, SECRET_KEY) as { id: number };
    const userId = decodedToken.id;

    if (!userId) {
      console.error("Error: Invalid token");
      throw createError({ statusCode: 400, statusMessage: "Invalid token" });
    }

    // Leer el body
    const body = await readBody(event);
    console.log("Datos recibidos en el POST:", body); // 👈 Agregar esto para depuración

    if (!body.title || !body.content) {
      console.error("Error: Faltan campos obligatorios");
      throw createError({ statusCode: 400, statusMessage: "Title and content are required" });
    }

    // Crear el post en la base de datos
    const newPost = await prisma.post.create({
      data: {
        title: body.title,
        content: body.content,
        userId,
      },
    });

    console.log("Post creado correctamente:", newPost);
    return newPost;
  } catch (error) {
    console.error("Error al crear el post:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error creando el post",
    });
  }
});
