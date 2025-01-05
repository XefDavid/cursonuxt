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
	<div
		class="border border-blue-500 bg-blue-200 font-mono text-sm text-center rounded-xl p-4"
	>
		<form
			class="flex flex-col gap-2 items-center justify-center"
			@submit.prevent="handleRegister"
		>
			<label for="name">Name:</label>
			<input
				v-model="name"
				id="name"
				type="text"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<label for="email">Email:</label>
			<input
				v-model="email"
				id="email"
				type="email"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<label for="password">Password:</label>
			<input
				v-model="password"
				id="password"
				type="password"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<label for="confirmPassword">Confirm Password:</label>
			<input
				v-model="confirmPassword"
				id="confirmPassword"
				type="password"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<button type="submit" class="bg-blue-300 rounded-xl w-20 p-1">
				Register
			</button>
		</form>
	</div>
</template>
