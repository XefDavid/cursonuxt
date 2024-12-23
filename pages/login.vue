<script setup lang="ts">
definePageMeta({
	layout: "plain",
});
</script>

<template>
	<form>
		<h1>Login</h1>
		<label for="username">Username</label>
		<input type="text" id="username" name="username" required />

		<label for="email">Email</label>
		<input type="email" id="email" name="email" required />

		<button type="submit">Login</button>
	</form>
</template>
