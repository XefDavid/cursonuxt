import bcrypt from "bcrypt";
import { users } from "../users"; // Suponiendo que `users` es un array con los usuarios
import { useRouter } from "vue-router";

const router = useRouter();

export default defineEventHandler(async (event) => {
	// Imprimir el array de usuarios para verificar que está llegando correctamente
	console.log("Usuarios disponibles:", users);

	const body = await readBody(event);
	// Imprimir el cuerpo de la solicitud para ver qué datos se están enviando
	console.log("Cuerpo de la solicitud:", body);

	// Buscar al usuario por email
	const user = users.find((u) => u.email === body.email);
	// Imprimir el usuario encontrado (o null si no se encontró)
	console.log("Usuario encontrado:", user);

	if (!user) {
		console.log("Credenciales inválidas: el usuario no existe");
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	// Verificar que la contraseña proporcionada coincida con el hash almacenado
	console.log("Verificando la contraseña proporcionada...");
	const isPasswordValid = await bcrypt.compare(body.password, user.password);
	// Imprimir el resultado de la comparación
	console.log("Contraseña válida:", isPasswordValid);

	if (!isPasswordValid) {
		console.log("Credenciales inválidas: la contraseña no coincide");
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	// Si la contraseña es válida, responder con éxito
	console.log("Usuario autenticado con éxito");
	return {
		success: true,
		message: "User logged in successfully",
	};
});
