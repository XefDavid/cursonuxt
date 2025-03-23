<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const sanitizeInput = (input: string) => {
	// Elimina etiquetas HTML y caracteres potencialmente peligrosos
	return input.replace(/<[^>]*>?/g, "").trim();
};

const handleSubmit = async () => {
	try {
		// Limpiar los mensajes previos
		errorMessage.value = "";
		successMessage.value = "";

		// Sanitizar los valores
		const sanitizedEmail = sanitizeInput(email.value);
		const sanitizedPassword = sanitizeInput(password.value);

		// Validaciones adicionales
		if (sanitizedEmail.length > 50 || sanitizedPassword.length > 20) {
			errorMessage.value = "Los datos ingresados exceden el límite permitido.";
			return;
		}

		// Mostrar los valores que se van a enviar
		console.log("Enviando datos al backend...");
		console.log("Email enviado:", sanitizedEmail);
		console.log("Contraseña enviada:", "*".repeat(sanitizedPassword.length));

		// Llamada al backend
		const response = await $fetch("/api/login", {
			method: "POST",
			body: {
				email: sanitizedEmail,
				password: sanitizedPassword,
			},
		});

		if (response.token) {
			localStorage.setItem("auth_token", response.token);
			successMessage.value = response.message;
			router.push("/main");
		} else {
			console.error("No se recibió el token.");
			errorMessage.value = "Error de autenticación.";
		}
	} catch (error: any) {
		errorMessage.value =
			error.data?.statusMessage || "Ups..! Ocurrió un error inesperado...";
	}
};
</script>

<template>
	<div class="border border-blue-500 bg-blue-200 font-mono text-sm text-center rounded-xl p-4">
		<form @submit.prevent="handleSubmit" class="flex flex-col gap-2 items-center justify-center">
			<!-- Email -->
			<label for="email">Email</label>
			<input v-model="email" type="email" id="email" name="email" required maxlength="50"
				class="text-center border border-black rounded-xl w-60 text-sm h-8" />

			<!-- Contraseña -->
			<label for="password">Password</label>
			<input v-model="password" type="password" id="password" name="password" required maxlength="20"
				class="text-center border border-black rounded-xl w-60 text-sm h-8" />

			<!-- Botón de login -->
			<button type="submit" class="bg-blue-300 rounded-xl w-20 p-1">
				Login
			</button>

			<!-- Mensajes -->
			<p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>
			<p v-if="successMessage" class="text-green-800">{{ successMessage }}</p>
		</form>
	</div>
</template>
