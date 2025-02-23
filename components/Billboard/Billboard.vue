<script>
import useMovieGlu from "@/composables/useMovieGlu";

export default {
	setup() {
		const { movies, error, fetchMovies } = useMovieGlu();

		fetchMovies();

		return { movies, error };
	},
};
</script>
<template>
	<div class="flex flex-col items-center justify-start pt-10 h-[100vh] overflow-auto">
		<div v-if="movies.length" class="">
			<h1 class="text-5xl font-bold font-mono text-stroke-yellow w-full p-8 text-center">Showing now !!</h1>

			<div class="">
				<ul class="gap-20 justify-center flex flex-col   w-[70%]">
					<li v-for="movie in movies" :key="movie.film_id"
						class="border border-black flex flex-col w-[340px] h-[550px] bg-blue-100">
						<h3 class="text-center text-normal text-gray-700 font-mono font-extrabold w-[250px]">
							{{ movie.film_name }}
						</h3>

						<img :src="movie.images.poster[1]?.medium.film_image || '/placeholder.jpg'
							" :alt="movie.film_name" class="border border-black w-[250px] h-[400px] p-4" />


					</li>
				</ul>
			</div>
		</div>
		<div v-else-if="error" class="text-center text-red-600">
			<p>Error al cargar las películas: {{ error }}</p>
		</div>
		<div v-else class="text-center text-gray-500">
			<p>Cargando películas...</p>
		</div>
	</div>
</template>

<style scoped>
.text-stroke-yellow {
	-webkit-text-stroke: 1px #e4c05f;
	-webkit-text-fill-color: #1e3a8a;
}

img {
	aspect-ratio: auto;
}
</style>
