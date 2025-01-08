<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref(""); // Usaremos email
const password = ref(""); // Nueva variable para la contraseña
const errorMessage = ref("");
const successMessage = ref("");

const handleSubmit = async () => {
	try {
		// Limpiar los mensajes previos
		errorMessage.value = "";
		successMessage.value = "";

		// Mostrar los valores que se van a enviar
		console.log("Enviando datos al backend...");
		console.log("Email enviado:", email.value);
		console.log("Contraseña enviada:", password.value);

		// Llamada al backend
		const response = await $fetch("/api/login", {
			method: "POST",
			body: {
				email: email.value,
				password: password.value,
			},
		});

		console.log("Respuesta del backend:", response); // Log para ver la respuesta completa

		// Verifica que el token esté presente en la respuesta
		if (response.token) {
			console.log("Token recibido:", response.token); // Log para mostrar el token recibido
			console.log("Mensaje recibido:", response); // Log para mostrar el mensaje recibido

			// Guarda el token en localStorage
			localStorage.setItem("auth_token", response.token);
			console.log("Token guardado en localStorage:", response.token);

			// Muestra el mensaje de éxito
			successMessage.value = response.message;

			// Redirige a la página /main
			router.push("/main"); // Cambia aquí la ruta de redirección
		} else {
			console.error("No se recibió el token.");
		}
	} catch (error: any) {
		// Manejo de errores
		errorMessage.value =
			error.data?.statusMessage || "Ups..! Ocurrió un error inesperado...";
	}
};
</script>

<template>
	<div
		class="border border-blue-500 bg-blue-200 font-mono text-sm text-center rounded-xl p-4"
	>
		<form
			@submit.prevent="handleSubmit"
			class="flex flex-col gap-2 items-center justify-center"
		>
			<!-- Email -->
			<label for="email">Email</label>
			<input
				v-model="email"
				type="email"
				id="email"
				name="email"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>

			<!-- Contraseña -->
			<label for="password">Password</label>
			<input
				v-model="password"
				type="password"
				id="password"
				name="password"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>

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
