import { PrismaClient } from "@prisma/client";
import formidable from "formidable";
import { createError, defineEventHandler, getHeader } from "h3";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret_key_for_jwt";

export default defineEventHandler(async (event) => {
    const form = formidable({ uploadDir: "./public/uploads", keepExtensions: true });

    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(event.req, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });

    console.log("Datos recibidos:", fields, files);

    const token = getHeader(event, "authorization")?.split(" ")[1];
    if (!token) {
        throw createError({ statusCode: 401, statusMessage: "Token is missing" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number };

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" });

        let profilePicUrl = user.profilePic; // Mantiene la imagen actual si no se sube una nueva

        if (files.profilePic && files.profilePic[0]) {
            profilePicUrl = `/uploads/${files.profilePic[0].newFilename}`;
        }

        const updatedUser = await prisma.user.update({
            where: { id: decoded.id },
            data: {
                name: fields.name ? fields.name[0] : user.name,
                email: fields.email ? fields.email[0] : user.email,
                description: fields.description ? fields.description[0] : user.description,
                profilePic: profilePicUrl,
            },
        });

        console.log("Usuario actualizado:", updatedUser);

        return { statusCode: 200, body: { id: updatedUser.id, name: updatedUser.name, profilePic: updatedUser.profilePic } };
    } catch (error) {
        console.error("Error en updateProfile.ts:", error);
        throw createError({ statusCode: 500, statusMessage: "Internal server error" });
    }
});
