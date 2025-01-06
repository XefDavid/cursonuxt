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
		// Check if passwords match
		if (password.value !== confirmPassword.value) {
			throw new Error("Passwords do not match.");
		}

		// Send data to the backend
		const response = await $fetch("/api/register", {
			method: "POST",
			body: {
				name: name.value,
				email: email.value,
				password: password.value,
			},
		});

		console.log("Server response:", response);

		// Show success message and redirect
		alert("User registered successfully.");
		router.push("/");
	} catch (error: any) {
		if (error?.data?.statusCode === 400) {
			// Handle error if the user is already registered
			alert("User already exists. Redirecting to the home page.");
			router.push("/");
		} else {
			// Handle other errors
			console.error("Error during user registration:", error);
			alert("An error occurred during registration.Try again.");
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
