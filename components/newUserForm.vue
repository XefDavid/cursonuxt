<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");

const sanitizeInput = (input: string) => {
	// Elimina etiquetas HTML y caracteres potencialmente peligrosos
	return input.replace(/<[^>]*>?/g, "").trim();
};

const handleRegister = async () => {
	try {
		// Limpiar mensajes previos
		errorMessage.value = "";

		// Sanitizar valores
		const sanitizedName = sanitizeInput(name.value);
		const sanitizedEmail = sanitizeInput(email.value);
		const sanitizedPassword = sanitizeInput(password.value);
		const sanitizedConfirmPassword = sanitizeInput(confirmPassword.value);

		// Validaciones
		if (!sanitizedName || !sanitizedEmail || !sanitizedPassword || !sanitizedConfirmPassword) {
			errorMessage.value = "Todos los campos son obligatorios.";
			return;
		}
		if (sanitizedName.length > 50 || sanitizedEmail.length > 50) {
			errorMessage.value = "El nombre y el email no deben superar los 50 caracteres.";
			return;
		}
		if (sanitizedPassword.length < 6 || sanitizedPassword.length > 20) {
			errorMessage.value = "La contraseña debe tener entre 6 y 20 caracteres.";
			return;
		}
		if (sanitizedPassword !== sanitizedConfirmPassword) {
			errorMessage.value = "Las contraseñas no coinciden.";
			return;
		}

		// Enviar los datos al backend
		const response = await $fetch("/api/register", {
			method: "POST",
			body: {
				name: sanitizedName,
				email: sanitizedEmail,
				password: sanitizedPassword,
			},
		});

		if (response?.message?.includes("User created successfully")) {
			alert("Usuario registrado exitosamente.");

			// Si hubo un problema enviando el correo, informar al usuario
			if (response?.emailError) {
				alert(
					"Registro completado, pero no pudimos enviar el correo de confirmación."
				);
			}

			// Redirigir al usuario después del registro exitoso
			router.push("/");
		} else {
			throw new Error("Respuesta inesperada del servidor.");
		}
	} catch (error: any) {
		if (error?.data?.statusCode === 400) {
			errorMessage.value = "El usuario ya existe.";
		} else {
			console.error("Error durante el registro:", error);
			errorMessage.value = "Ocurrió un error inesperado.";
		}
	}
};
</script>

<template>
	<div class="border border-blue-500 bg-blue-200 font-mono text-sm text-center rounded-xl p-4">
		<form class="flex flex-col gap-2 items-center justify-center" @submit.prevent="handleRegister">
			<label for="name">Nombre:</label>
			<input v-model="name" id="name" type="text" required maxlength="50"
				class="text-center border border-black rounded-xl w-60 text-sm h-8" />

			<label for="email">Email:</label>
			<input v-model="email" id="email" type="email" required maxlength="50"
				class="text-center border border-black rounded-xl w-60 text-sm h-8" />

			<label for="password">Contraseña:</label>
			<input v-model="password" id="password" type="password" required maxlength="20"
				class="text-center border border-black rounded-xl w-60 text-sm h-8" />

			<label for="confirmPassword">Confirmar Contraseña:</label>
			<input v-model="confirmPassword" id="confirmPassword" type="password" required maxlength="20"
				class="text-center border border-black rounded-xl w-60 text-sm h-8" />

			<!-- Mensaje de error -->
			<p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>

			<button type="submit" class="rounded-xl w-20 p-1" :class="{
				'bg-blue-400': name && email && password && confirmPassword,
				'border border-blue-500':
					name && email && password && confirmPassword,
			}">
				Registrarse
			</button>
		</form>
	</div>
</template>
