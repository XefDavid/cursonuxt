<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const username = ref("");
const email = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const handleSubmit = async () => {
	try {
		errorMessage.value = "";
		successMessage.value = "";

		const response = await $fetch("/api/login", {
			method: "POST",
			body: {
				username: username.value,
				email: email.value,
			},
		});

		successMessage.value = response.message;
		console.log("Usuario logeado con éxito", successMessage.value);
		router.push("/movies/searchMovies");
	} catch (error: any) {
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
			<label for="username">Username</label>
			<input
				v-model="username"
				type="text"
				id="username"
				name="username"
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
			<button type="submit" class="bg-blue-300 rounded-xl w-20 p-1">
				Login
			</button>

			<!-- Mensajes -->
			<p v-if="errorMessage" class="text-red-700">{{ errorMessage }}</p>
			<p v-if="successMessage" class="text-green-800">{{ successMessage }}</p>
		</form>
	</div>
</template>
