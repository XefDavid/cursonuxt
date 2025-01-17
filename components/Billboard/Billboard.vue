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
	<div class="">
		<div v-if="movies.length" class="">
			<h1 class="">Showing now !!</h1>

			<div class="">
				<ul class="">
					<li v-for="movie in movies" :key="movie.film_id" class="">
						<img
							:src="
								movie.images.poster[1]?.medium.film_image || '/placeholder.jpg'
							"
							:alt="movie.film_name"
							class=""
						/>
						<div class="">
							<h3 class="">
								{{ movie.film_name }}
							</h3>
						</div>
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
