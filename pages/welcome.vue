<script setup lang="ts">
import LoginForm from "~/components/LoginForm.vue";
useHead({
	title: "WelcomeToTheBestSearchMachineMovies",
});
</script>

<template>
	<div>
		<h1>welcome to the best search machine movies</h1>
		<LoginForm />
		<div class="p-5">
			<nuxt-link to="/newUserForm">
				<h1
					class="text-blue-500 border border-blue-600 rounded-xl p-2 font-mono !flex !justify-center bg-blue-50"
				>
					i´m a new user
				</h1>
			</nuxt-link>
		</div>
	</div>
</template>
