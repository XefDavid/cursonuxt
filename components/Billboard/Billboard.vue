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
	<div class="flex flex-col items-center justify-start pt-10 h-[100vh] w-full overflow-auto">
		<div v-if="movies.length" class="w-full p-20">
			<h1 class="text-5xl font-bold font-mono text-stroke-yellow pb-10 w-full text-center">Showing now !!</h1>

			<div class="">
				<ul class="gap-20 justify-center flex flex-col w-full">
					<li v-for="movie in movies" :key="movie.film_id"
						class="border border-black flex flex-col w-full  bg-blue-100">
						<h3
							class="text-center text-normal text-gray-700 font-mono font-extrabold w-full text-3xl underline p-4">
							{{ movie.film_name }}
						</h3>

						<div class="flex flex-row gap-4 p-4">
							<img :src="movie.images.poster[1]?.medium.film_image || '/placeholder.jpg'
								" :alt="movie.film_name" class="border border-black w-[250px] h-[400px] p-4" />
							<div class="flex flex-col  justify-start items-start p-2 gap-2">
								<p v-if="movie.release_dates.length"
									class="text-center text-gray-700 font-mono font-bold w-[250px] flex flex-row">
									Release date:
									<span class="text-base pl-3">{{ movie.release_dates[0]?.release_date }}</span>
								</p>
								<p v-if="movie.synopsis_long"
									class="text-start text-normal text-gray-700 font-mono  w-full">
									{{ movie.synopsis_long }}
								</p>
								<p v-else class="text-start text-normal text-gray-700 font-mono  w-full">Synopsis no
									available</p>

								<div class="mt-auto ml-auto p-5">
									<a v-if="movie.film_trailer" :href="movie.film_trailer" target="_blank"
										rel="noopener noreferrer"
										class="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-700 transition h-[36px] w-full">
										See Trailer 🎬
									</a>
									<a v-else
										class="px-4 py-2 bg-gray-500 text-white font-bold rounded-lg h-[36px] w-full">Trailer
										not available</a>
								</div>

							</div>



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
