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
		// Verifica si las contraseñas coinciden
		if (password.value !== confirmPassword.value) {
			throw new Error("Passwords do not match.");
		}

		// Envía los datos al backend
		const response = await $fetch("/api/register", {
			method: "POST",
			body: {
				name: name.value,
				email: email.value,
				password: password.value,
			},
		});

		console.log("Response from server:", response); // Depuración

		// Procesa la respuesta del backend
		if (response?.message?.includes("User created successfully")) {
			alert("User registered successfully.");

			// Si hubo un problema enviando el correo, informa al usuario
			if (response?.emailError) {
				alert(
					"Registration completed, but we could not send the confirmation email."
				);
			}

			// Redirige al usuario después de un registro exitoso
			router.push("/");
		} else {
			// Manejo de respuestas inesperadas
			throw new Error("Unexpected response from server.");
		}
	} catch (error: any) {
		// Manejo del caso de usuario ya existente
		if (error?.data?.statusCode === 400) {
			alert("User already exists. Redirecting to the home page.");
			router.push("/");
		} else {
			// Manejo de otros errores
			console.error("Error during user registration:", error);
			router.push("/");
		}
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
			<button
				type="submit"
				class="rounded-xl w-20 p-1"
				:class="{
					'bg-blue-400': name && email && password && confirmPassword,
					'border border-blue-500':
						name && email && password && confirmPassword,
				}"
			>
				Register
			</button>
		</form>
	</div>
</template>
