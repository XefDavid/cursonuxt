<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const router = useRouter();

const userId = ref(null);

onMounted(async () => {
	const token = localStorage.getItem("auth_token");

	if (!token) {
		console.log("🔒 No estás autenticado. Redirigiendo al login...");
		router.push("/");
		return;
	}

	try {
		const response = await fetch("/api/user", {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		const userData = await response.json();
		console.log("Usuario obtenido:", userData);
		userId.value = userData.id; // Guardamos el ID
	} catch (error) {
		console.error("Error al obtener usuario:", error);
		router.push("/");
	}
});

const route = useRoute();
const {
	public: { omdbApiKey },
} = useRuntimeConfig();

interface MovieData {
	Title: string;
	Year: string;
	Rated: string;
	Runtime: string;
	Released: string;
	Genre: string;
	Director: string;
	Writer: string;
	Actors: string;
	Plot: string;
	Country: string;
	Awards: string;
	BoxOffice: string;
	Poster: string;
}
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

useHead({ title: data.Title });

// Estado para controlar el favorito
const isFavorite = ref(false);

// Función para alternar estado y mostrar alerta
console.log("Movie data:", data);
const toggleFavorite = async () => {
	if (!userId.value) {
		alert("Error: No se pudo obtener el ID del usuario.");
		return;
	}

	console.log("Usuario autenticado, ID:", userId.value);

	try {
		const response = await fetch("/api/addFavorite", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				userId: userId.value, // ✅ Ahora tenemos el ID correcto
				title: data.value.Title,
			}),
		});

		const result = await response.json();
		console.log("Respuesta del servidor:", result);

		if (response.ok) {
			isFavorite.value = true;
			alert("Película agregada a favoritos.");
		} else {
			alert("Error al agregar favorito.");
		}
	} catch (error) {
		console.error("Error en toggleFavorite:", error);
		alert("Hubo un error al procesar tu solicitud.");
	}
};








</script>

<template>
	<div class="p-8">
		<div class="p-3">
			<nuxt-link to="/movies/searchMovies">
				<button
					class="bg-blue-500 text-white font-semibold rounded-xl w-24 h-10 shadow-md hover:bg-blue-700 transition-all">
					⬅ Back
				</button>
			</nuxt-link>
		</div>

		<!-- Contenedor de la película -->
		<div
			class="flex flex-row items-center justify-center border border-black bg-blue-50 rounded-xl p-6 relative w-[90%] mx-auto shadow-lg">
			<!-- Poster -->
			<div class="p-6 w-[30%]">
				<h1 class="text-3xl font-extrabold font-mono">{{ data.Title }}</h1>
				<img :src="data.Poster" alt="movie"
					class="border border-black w-[350px] h-[500px] rounded-lg shadow-md" />
			</div>

			<!-- Información -->
			<div class="w-full p-4">
				<div class="flex items-start justify-end p-6">
					<img src="~/assets/images/logo.webp" alt="logo" class="w-40 h-40" />
				</div>
				<p><strong>Year:</strong> {{ data.Year }}</p>
				<p><strong>Rated:</strong> {{ data.Rated }}</p>
				<p><strong>Runtime:</strong> {{ data.Runtime }}</p>
				<p><strong>Released:</strong> {{ data.Released }}</p>
				<p><strong>Genre:</strong> {{ data.Genre }}</p>
				<p><strong>Director:</strong> {{ data.Director }}</p>
				<p><strong>Writer:</strong> {{ data.Writer }}</p>
				<p><strong>Actors:</strong> {{ data.Actors }}</p>
				<p><strong>Plot:</strong> {{ data.Plot }}</p>
				<p><strong>Country:</strong> {{ data.Country }}</p>
				<p><strong>Awards:</strong> {{ data.Awards }}</p>
				<p><strong>BoxOffice:</strong> {{ data.BoxOffice }}</p>
			</div>

			<!-- Botón de favoritos / Estrella -->
			<div class="absolute bottom-4 right-4">
				<!-- Si no está en favoritos, muestra el botón -->
				<button v-if="!isFavorite" @click="toggleFavorite"
					class="bg-blue-300 text-gray-800 font-semibold rounded-xl w-40 h-10 shadow-md hover:bg-blue-500 transition-all">
					Add favorites!
				</button>

				<!-- Si está en favoritos, muestra la estrella -->
				<span v-else class="text-yellow-500 text-4xl">⭐</span>
			</div>
		</div>
	</div>
</template>

<style scoped>
button {
	transition: all 0.2s ease-in-out;
}
</style>
