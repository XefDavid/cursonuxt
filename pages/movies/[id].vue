<script setup lang="ts">
const route = useRoute();
const {
	public: { omdbApiKey },
} = useRuntimeConfig();

const { data } = useAsyncData(() => {
	return $fetch(
		`https://www.omdbapi.com/?apikey=${omdbApiKey}&i=${route.params.id}`
	);
});
</script>

<template>
	<nuxt-link to="/">
		<button class="bg-blue-300 rounded-xl w-20 h-8">Back</button>
	</nuxt-link>
	<div class="flex flex-col w-300px h-400px">
		<h1>{{ data.Title }}</h1>
		<img :src="data.Poster" alt="movie" />
		<p>{{ data.Year }}</p>
		<p>{{ data.Rated }}</p>
		<p>{{ data.Runtime }}</p>
		<p>{{ data.Released }}</p>
		<p>{{ data.Genre }}</p>
	</div>
	<pre>{{ data }}</pre>
</template>

<style scoped></style>
