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
	<div>
		<h1>{{ data }}</h1>
	</div>
	<pre>{{ data }}</pre>
</template>

<style scoped></style>
