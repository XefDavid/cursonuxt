import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	console.log("Endpoint /api/user fue llamado"); // Log inicial

	// Leer el token desde los headers
	const token = getHeader(event, "authorization")?.split(" ")[1];
	console.log("Token recibido en el backend:", token);

	if (!token) {
		console.log("No se proporcionó un token");
		return {
			statusCode: 401,
			body: { error: "No se proporcionó un token" },
		};
	}

	try {
		const secretKey = "secret_key_for_jwt";
		let decodedToken: any;

		// Verificar el token
		console.log("Token recibido en el backend:", token);

		try {
			decodedToken = jwt.verify(token, secretKey);
			console.log("Token decodificado correctamente:", decodedToken);
		} catch (error) {
			console.error("Error al verificar el token:", error.message);
			return {
				statusCode: 401,
				body: { error: "Token inválido o expirado" },
			};
		}

		// Obtener el ID del usuario
		const userId = decodedToken.id;
		console.log("ID del usuario obtenido del token:", userId);

		// Buscar al usuario en la base de datos
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				id: true,
				name: true,
				email: true,
			},
		});
		console.log("Usuario encontrado en la base de datos:", user);

		if (!user) {
			console.log("Usuario no encontrado en la base de datos");
			return {
				statusCode: 404,
				body: { error: "Usuario no encontrado" },
			};
		}

		// Devolver los datos del usuario
		return {
			statusCode: 200,
			body: user,
		};
	} catch (error) {
		console.error("Error en el servidor:", error);
		return {
			statusCode: 500,
			body: { error: "Error interno del servidor" },
		};
	}
});
