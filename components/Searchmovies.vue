<script setup lang="ts">
const query = ref("");
const movies = ref([]);
import logo from "~/assets/images/logo.webp";

const {
	public: { omdbApiKey },
} = useRuntimeConfig();

const search = async () => {
	const { Search } = await $fetch(
		`http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query.value}`
	);
	movies.value = Search;
};
useHead({
	title: "Search movies",
});
</script>

<template>
	<div class="flex flex-col items-center justify-center pt-20">
		<h1 class="text-3xl font-bold font-mono underline pb-7">
			Search information aboutyour favorite films
		</h1>
		<img class="w-40 h-40 border border-blue-500" :src="logo" alt="Logo" />
		<form class="flex flex-row gap-2 rounded-xl pt-7" @submit.prevent="search">
			<input
				type="text"
				v-model="query"
				class="border border-black rounded-xl w-60 text-sm text-center h-8"
				placeholder="Search your favorite films"
			/>
			<button class="bg-blue-300 rounded-xl w-20">Search</button>
		</form>
		<ul class="gap-20 justify-center grid grid-cols-3 p-12 w-[70%]">
			<li
				v-for="movie in movies"
				key="movie.imdbID"
				class="border border-black flex items-center justify-center w-[340px] h-[550px] bg-blue-50"
			>
				<NuxtLink :to="{ name: 'movies-id', params: { id: movie.imdbID } }">
					<p
						class="text-center text-normal text-gray-700 font-mono font-extrabold w-[250px] pb-10"
					>
						{{ movie.Title }}
					</p>
					<img
						:src="movie.Poster"
						alt="movie"
						class="border border-black w-[250px] h-[400px]"
					/>
				</NuxtLink>
			</li>
		</ul>
	</div>
</template>

<style scoped></style>
