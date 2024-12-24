import bcrypt from "bcrypt";
import { users } from "../users";
import { useRouter } from "vue-router";

const router = useRouter();

export default defineEventHandler(async (event) => {
	console.log("Usuarios existentes:", users); // Mostrar los usuarios existentes al momento de crear un nuevo usuario

	const { name, email, password } = await readBody(event);
	console.log("Datos recibidos del cuerpo de la solicitud:", {
		name,
		email,
		password,
	}); // Mostrar los datos recibidos en la solicitud

	// Verificar si el usuario ya existe
	const existingUser = users.find((user) => user.email === email);
	console.log("Usuario encontrado con el email proporcionado:", existingUser); // Mostrar el usuario encontrado (si existe)

	if (existingUser) {
		console.log("El usuario ya existe con el email:", email); // Si el usuario ya existe, lo indicamos
		throw createError({
			statusCode: 400,
			statusMessage: "User already exists",
		});
	}

	// Si el usuario no existe, se procede a hashear la contraseña
	console.log("Hasheando la contraseña...");
	const hashedPassword = await bcrypt.hash(password, 10);
	console.log("Contraseña hasheada:", hashedPassword); // Mostrar la contraseña hasheada (con cuidado en un entorno de producción)

	// Crear el nuevo usuario
	const newUser = { name, email, password: hashedPassword };
	console.log("Nuevo usuario creado:", newUser); // Mostrar el nuevo usuario antes de agregarlo

	// Agregar el nuevo usuario al array de usuarios
	users.push(newUser);

	return { message: "User created successfully" };
});
