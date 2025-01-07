import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default defineEventHandler(async (event) => {
	const body = await readBody(event);

	const { email, password } = body;

	if (!email || !password) {
		throw createError({
			statusCode: 400,
			statusMessage: "Email and password are required",
		});
	}

	const user = await prisma.user.findUnique({
		where: { email },
	});

	if (!user) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	const isPasswordValid = await bcrypt.compare(password, user.password);

	if (!isPasswordValid) {
		throw createError({
			statusCode: 401,
			statusMessage: "Invalid credentials. Please verify your information.",
		});
	}

	return {
		message: "User logged in successfully",
	};
});
