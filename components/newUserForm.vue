<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const handleRegister = () => {
	const errorMessage = ref("");
	const successMessage = ref("");
	if (password.value !== confirmPassword.value) {
		errorMessage.value = "Las contraseñas no coinciden";
		return;
	}
	try {
		const response = $fetch("/api/register", {
			method: "POST",
			body: {
				name: name.value,
				email: email.value,
				password: password.value,
			},
		});

		successMessage.value = response.message;
		console.log("Usuario registrado con éxito", successMessage.value);
		router.push("/login");
	} catch (error: any) {
		errorMessage.value =
			error.data?.statusMessage || "Ups..! Ocurrio un error inesperado...";
		console.log({
			error: errorMessage.value,
		});
	}
};
</script>

<template>
	<div class="items-center justify-center pt-20">
		<form
			@submit.prevent="handleRegister"
			class="flex flex-col gap-2 items-center"
		>
			<label for="name">name </label>
			<input
				v-model="name"
				type="text"
				id="name"
				name="name"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<label for="email">Email</label>
			<input
				v-model="email"
				type="email"
				id="email"
				name="email"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<label for="password">Password</label>
			<input
				type="password"
				id="password"
				name="password"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<label for="confirmpassword">Confirm Password"></label>
			<input
				type="password"
				id="confirmpassword"
				name="confirmpassword"
				required
				class="text-center border border-black rounded-xl w-60 text-sm h-8"
			/>
			<button type="submit" class="bg-blue-300 rounded-xl w-20 p-1">
				Register
			</button>
			<p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
			<p v-if="successMessage" class="text-green-500">{{ successMessage }}</p>
		</form>
	</div>
</template>
