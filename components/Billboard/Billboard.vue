<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

// API base URL y clave
const apikey = import.meta.env.VITE_MOVIEGLU_API_KEY;
if (!apikey) {
	throw new Error("API key not found");
}
const apiBaseUrl = "https://api-gate2.movieglu.com";

// Variables de estado
const city = ref("");
const title = ref("");
const movies = ref([]);
const loading = ref(false);
const error = ref<string | null>(null);

// Obtener film_id por título
const getFilmIdByTitle = async (title: string) => {
	movies.value = [];
	loading.value = true;
	error.value = null;

	try {
		const response = await axios.get(`${apiBaseUrl}/filmsNowShowing/`, {
			headers: {
				"x-api-key": apikey,
				client: "your_client_name",
				territory: "ES",
				"api-version": "v200",
			},
			params: {
				n: 10, // Limitar a las 10 primeras películas
			},
		});

		const film = response.data.films.find(
			(film: any) => film.title.toLowerCase() === title.toLowerCase()
		);

		if (film) {
			return film.film_id;
		} else {
			error.value = "Movie not found.";
			return null;
		}
	} catch (err: any) {
		error.value = err.message || "Unknown error";
		return null;
	} finally {
		loading.value = false;
	}
};

// Obtener horarios de la película
const getMovieShowtimes = async (filmId: number, city: string) => {
	movies.value = [];
	loading.value = true;
	error.value = null;

	try {
		const response = await axios.get(`${apiBaseUrl}/cinemaShowTimes/`, {
			headers: {
				"x-api-key": apikey,
				client: "your_client_name",
				territory: "ES",
				"api-version": "v200",
			},
			params: {
				film_id: filmId,
				city: city,
				date: new Date().toISOString().split("T")[0], // Fecha actual en formato YYYY-MM-DD
			},
		});

		if (response.data.status.state === "OK" && response.data.showtimes) {
			movies.value = response.data.showtimes;
		} else {
			error.value = "No showtimes found for the given movie and city.";
		}
	} catch (err: any) {
		error.value = err.message || "Unknown error";
	} finally {
		loading.value = false;
	}
};

// Buscar película y obtener horarios
const searchAndGetShowtimes = async () => {
	const filmId = await getFilmIdByTitle(title.value);
	if (filmId) {
		await getMovieShowtimes(filmId, city.value);
	}
};
</script>

<template>
	<div class="container">
		<h1>Movie Schedule</h1>
		<form @submit.prevent="searchAndGetShowtimes">
			<input v-model="city" placeholder="Enter your city" />
			<input v-model="title" placeholder="Enter movie title" />
			<button>Search</button>
		</form>

		<div v-if="loading">Loading...</div>
		<div v-if="error">{{ error }}</div>

		<div v-if="movies.length > 0">
			<ul>
				<li v-for="cinema in movies" :key="cinema.cinema_id">
					<h3>{{ cinema.cinema_name }}</h3>
					<img :src="cinema.logo_url" alt="Cinema Logo" />
					<div
						v-for="showing in cinema.showings.Standard.times"
						:key="showing.start_time"
					>
						<p>{{ showing.start_time }} - {{ showing.end_time }}</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>
