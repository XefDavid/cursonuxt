<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const handleRegister = async () => {
	try {
		// Verificar que las contraseñas coincidan
		if (password.value !== confirmPassword.value) {
			throw new Error("Las contraseñas no coinciden.");
		}

		// Enviar los datos al backend
		const response = await $fetch("/api/register", {
			method: "POST",
			body: {
				name: name.value,
				email: email.value,
				password: password.value,
			},
		});

		console.log("Respuesta del servidor:", response);
		router.push("/login");
	} catch (error) {
		console.error("Error al registrar el usuario:", error);
	}
};
</script>

<template>
	<form @submit.prevent="handleRegister">
		<label for="name">Name:</label>
		<input v-model="name" id="name" type="text" required />

		<label for="email">Email:</label>
		<input v-model="email" id="email" type="email" required />

		<label for="password">Password:</label>
		<input v-model="password" id="password" type="password" required />

		<label for="confirmPassword">Confirm Password:</label>
		<input
			v-model="confirmPassword"
			id="confirmPassword"
			type="password"
			required
		/>

		<button type="submit">Register</button>
	</form>
</template>
