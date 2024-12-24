import bcrypt from "bcrypt";

const users = []; // Lista temporal de usuarios (debería ser reemplazada por una base de datos real)

export default defineEventHandler(async (event) => {
	// Lee los datos del cuerpo de la solicitud
	const { name, email, password } = await readBody(event);

	// Verifica si ya existe un usuario con ese correo electrónico
	if (users.find((user) => user.email === email)) {
		throw createError({
			statusCode: 400,
			statusMessage: "User already exists",
		});
	}

	// Genera un hash de la contraseña
	const hashedPassword = await bcrypt.hash(password, 10);

	// Crea un nuevo usuario
	const newUser = { name, email, password: hashedPassword };

	// Guarda el nuevo usuario en el arreglo temporal (en producción, esto iría en una base de datos)
	users.push(newUser);

	// Devuelve una respuesta exitosa
	return { message: "User created successfully" };
});
