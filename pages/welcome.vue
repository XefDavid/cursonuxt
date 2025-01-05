<script setup lang="ts">
import LoginForm from "~/components/LoginForm.vue";
useHead({
	title: "WelcomeToTheBestSearchMachineMovies",
});
const runtimeConfig = useRuntimeConfig();
const imageUrl = `${runtimeConfig.public.baseUrl}/images/background.webp`;
</script>

<template>
	<div
		id="imageBackground"
		class="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
		:style="{ backgroundImage: `url('/images/background.webp')` }"
	>
		<h1 class="text-7xl font-bold font-mono text-blue-900 text-stroke-yellow">
			Movies World
		</h1>
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
<style>
.text-stroke-yellow {
	-webkit-text-stroke: 1px #000000;
	-webkit-text-fill-color: #1e3a8a;
}
</style>
