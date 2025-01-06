import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client"; // Importa PrismaClient

const prisma = new PrismaClient(); // Instancia de PrismaClient

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	// Verificar que se envió un email y una contraseña
	const { email, password } = body;

	if (!email || !password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Email and password are required",
		});
	}

	// Buscar al usuario por email en la base de datos
	const user = await prisma.user.findUnique({
		where: { email }, // Buscamos el usuario por su email
	});

	// Si no existe el usuario, lanzar error de credenciales inválidas
	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	// Verificar que la contraseña proporcionada coincida con el hash almacenado
	const isPasswordValid = await bcrypt.compare(password, user.password);

	// Si la contraseña no coincide, lanzar error de credenciales inválidas
	if (!isPasswordValid) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	// Si las credenciales son correctas, responder con un mensaje de éxito
	console.log("Usuario autenticado con éxito");

	return {
		message: "User logged in successfully",
	};
});
