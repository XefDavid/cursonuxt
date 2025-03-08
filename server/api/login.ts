import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; // Asegúrate de instalar esta dependencia

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret_key_for_jwt"; // Llave secreta para firmar el token

export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const { email, password } = body;

	if (!email || !password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Email and password are required",
		});
	}

	// Busca al usuario en la base de datos
	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	// Verifica la contraseña
	const isPasswordValid = await bcrypt.compare(password, user.password);
	if (!isPasswordValid) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	// Genera el token JWT
	const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
		expiresIn: "1h", // Configura el tiempo de expiración
	});

	console.log("Token generado:", token); // Añade este log para ver el token generado
	return {
		message: "User logged in successfully",
		token, // Devuelve el token generado
	};
});
