<script setup lang="ts">
const route = useRoute();
const {
	public: { omdbApiKey },
} = useRuntimeConfig();

const { data } = await useFetch(
	`http://www.omdbapi.com/?apikey=${omdbApiKey}&i=${route.params.id}`,
	{
		pick: [
			"Poster",
			"Title",
			"Year",
			"Rated",
			"Runtime",
			"Released",
			"Genre",
			"Director",
			"Writer",
			"Actors",
			"Plot",
			"Country",
			"Awards",
			"BoxOffice",
		],
	}
);
useHead({
	title: data.Title,
});
</script>

<template>
	<div class="p-8">
		<div class="p-3">
			<nuxt-link to="/movies/searchMovies">
				<button class="bg-blue-300 rounded-xl w-20 h-8 container">Back</button>
			</nuxt-link>
		</div>
		<div
			class="flex flex-row items-center justify-center w-300px h-400px font-mono border border-black bg-blue-50 rounded-xl"
		>
			<div class="p-6 w-[30%]">
				<h1 class="text-3xl font-extrabold font-mono">{{ data.Title }}</h1>
				<img
					:src="data.Poster"
					alt="movie"
					class="border border-black w-[350px] h-[500px]"
				/>
			</div>

			<div class="w-full">
				<div class="flex items-start justify-end p-6">
					<img src="~/assets/images/logo.webp" alt="logo" class="w-40 h-40" />
				</div>
				<p>Year : {{ data.Year }}</p>
				<p>Rated : {{ data.Rated }}</p>
				<p>Runtime : {{ data.Runtime }}</p>
				<p>Released : {{ data.Released }}</p>
				<p>Genre :{{ data.Genre }}</p>
				<p>Director : {{ data.Director }}</p>
				<p>Writer : {{ data.Writer }}</p>
				<p>Actors : {{ data.Actors }}</p>
				<p>Plot : {{ data.Plot }}</p>
				<p>Country : {{ data.Country }}</p>
				<p>Awards : {{ data.Awards }}</p>
				<p>BoxOffice : {{ data.BoxOffice }}</p>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
