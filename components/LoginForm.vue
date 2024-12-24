<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref(""); // Usaremos email
const password = ref(""); // Nueva variable para la contraseña
const errorMessage = ref("");
const successMessage = ref("");

const handleSubmit = async () => {
	console.log("Enviando datos al backend...");

	try {
		// Limpiar los mensajes previos
		errorMessage.value = "";
		successMessage.value = "";

		// Mostrar los valores que se van a enviar
		console.log("Email enviado:", email.value);
		console.log("Contraseña enviada:", password.value);

		// Enviar email y password al backend
		const response = await $fetch("/api/login", {
			method: "POST",
			body: {
				email: email.value,
				password: password.value,
			},
		});

		// Si el login es exitoso, mostrar mensaje y redirigir
		successMessage.value = response.message;
		console.log("Usuario logeado con éxito:", successMessage.value);

		// Redirigir al usuario
		router.push("/movies/searchMovies");
		console.log("Redirigiendo a /movies/searchMovies");
	} catch (error: any) {
		// Mostrar el error devuelto por el backend
		console.error("Error durante el login:", error); // Log para el error completo
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
