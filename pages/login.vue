<script setup lang="ts">
const username = ref("");
const email = ref("");

const handleSubmit = () => {
	console.log("Username:", username.value);
	console.log("Email:", email.value);
};
</script>

<template>
	<div class="border border-blue-500 bg-red-200">
		<form @submit.prevent="handleSubmit">
			<h1>Login</h1>
			<label for="username">Username</label>
			<input
				v-model="username"
				type="text"
				id="username"
				name="username"
				required
			/>
			<label for="email">Email</label>
			<input v-model="email" type="email" id="email" name="email" required />
			<button type="submit">Login</button>
		</form>
	</div>
</template>
