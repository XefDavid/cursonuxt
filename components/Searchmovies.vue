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
	<div
		class="flex flex-col items-center justify-start pt-10 h-[100vh] overflow-auto"
	>
		<h1
			class="text-5xl font-bold font-mono text-stroke-yellow w-full p-8 text-center"
		>
			Find Your Favorite Movies
		</h1>
		<form class="flex flex-row gap-2 rounded-xl pt-7" @submit.prevent="search">
			<input
				type="text"
				v-model="query"
				class="border border-black rounded-xl w-60 text-sm text-center h-8"
				placeholder="Search your favorite films"
			/>
			<button
				class="rounded-xl w-20"
				:class="{
					'bg-gray-300': !query,
					'bg-blue-400': query,
					'border border-blue-500': query,
				}"
			>
				Search
			</button>
		</form>
		<ul class="gap-20 justify-center grid grid-cols-3 p-12 w-[70%]">
			<li
				v-for="movie in movies"
				key="movie.imdbID"
				class="border border-black flex items-center justify-center w-[340px] h-[550px] bg-blue-100"
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

<style scoped>
.text-stroke-yellow {
	-webkit-text-stroke: 1px #e4c05f;
	-webkit-text-fill-color: #1e3a8a;
}
</style>
