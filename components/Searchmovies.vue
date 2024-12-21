<script setup lang="ts">
const query = ref("");
const movies = ref([]);

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
</template>

<style scoped></style>
