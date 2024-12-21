<script setup lang="ts">
const query = ref("");
const movies = ref([]);
const apikey = "7401552a";
const {
	public: { omdbApiKey },
} = useRuntimeConfig();

const search = async () => {
	const { Search } = await $fetch(
		`http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query.value}`
	);
	movies.value = Search;
};
</script>

<template>
	<form class="flex flex-row gap-2 rounded-xl" @submit.prevent="search">
		<input
			type="text"
			v-model="query"
			class="border border-black rounded-xl w-60 text-sm text-center h-8 w/20"
			placeholder="Search your favorite films"
		/>
		<button class="bg-blue-300 rounded-xl w-20">Search</button>
	</form>
	<ul>
		<li v-for="movie in movies" key="movie.imdbID">
			<NuxtLink :to="{ name: 'movies-id', params: { id: movie.imdbID } }">
				<img :src="movie.Poster" alt="movie" />
			</NuxtLink>
		</li>
	</ul>
	<pre>{{ movies }}</pre>
</template>

<style scoped></style>
