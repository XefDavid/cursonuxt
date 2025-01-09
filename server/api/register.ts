import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { sendEmail } from "~/utils/email"; // Asegúrate de que esta ruta sea correcta

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
	const { name, email, password } = await readBody(event);

	console.log("Recibiendo datos del usuario:", { name, email });
	console.log("Verificando si el usuario existe...");

	const existingUser = await prisma.user.findUnique({
		where: { email },
	});

	if (existingUser) {
		throw createError({
			statusCode: 400,
			statusMessage: "User already exists",
		});
	}
	console.log("Creando nuevo usuario...");

	const hashedPassword = await bcrypt.hash(password, 10);

	const newUser = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
		},
	});

	// Enviar correo al usuario registrado
	try {
		const subject = "¡Bienvenido a Mi App!";
		const text = `Hola ${name},\n\nGracias por registrarte en Mi App. ¡Estamos emocionados de tenerte con nosotros!\n\nSaludos,\nEl equipo de Mi App.`;
		const html = `
      <h1>Hola ${name},</h1>
      <p>Gracias por registrarte en <b>Mi App</b>. ¡Estamos emocionados de tenerte con nosotros!</p>
      <p>Saludos,<br>El equipo de Mi App.</p>
    `;

		await sendEmail(email, subject, text, html);
		console.log("Correo de bienvenida enviado a", email);
	} catch (error) {
		console.error("Error enviando correo:", error);

		// Envía un mensaje al frontend, pero no interrumpe el flujo
		return {
			message: "User created successfully, but email sending failed.",
			user: newUser,
			emailError: error.message,
		};
	}
});
