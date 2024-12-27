import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient(); // Instancia de PrismaClient

export default defineEventHandler(async (event) => {
	const { name, email, password } = await readBody(event);

	// Verificar si el usuario ya existe en la base de datos
	const existingUser = await prisma.user.findUnique({
		where: { email }, // Buscamos al usuario por el email
	});

	if (existingUser) {
		throw createError({
			statusCode: 400,
			statusMessage: "User already exists", // Si el usuario ya existe, lanzamos un error
		});
	}

	// Hashear la contraseña
	const hashedPassword = await bcrypt.hash(password, 10);

	// Crear el nuevo usuario en la base de datos
	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	return { message: "User created successfully", user: newUser }; // Devolver la respuesta con el nuevo usuario
});
