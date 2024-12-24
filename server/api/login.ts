export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	// Validación de credenciales
	if (body.username === "testuser" && body.email === "test@example.com") {
		return {
			success: true,
		};
	}

	// En caso de error, devolver un mensaje claro
	throw createError({
		statusCode: 401,
		statusMessage: "Invalid credentials. Please verify your information.",
	});
});
