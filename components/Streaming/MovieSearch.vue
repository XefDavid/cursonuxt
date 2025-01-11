<template>
	<div>
		<h1>Busca una película</h1>
		<form @submit.prevent="handleSearch">
			<input
				type="text"
				v-model="searchQuery"
				placeholder="Ingresa el título de la película"
			/>
			<button type="submit">Buscar</button>
		</form>

		<div v-if="loading">Cargando...</div>

		<div v-if="error" class="error">{{ error }}</div>

		<ul v-if="movies.length > 0">
			<li v-for="movie in movies" :key="movie.id">
				<strong>{{ movie.name }}</strong> ({{ movie.year }})
				<button @click="fetchProviders(movie.id)">Ver plataformas</button>
			</li>
		</ul>

		<div v-if="providers.length > 0">
			<h2>Plataformas disponibles:</h2>
			<ul>
				<li v-for="provider in providers" :key="provider.source_id">
					{{ provider.name }} -
					<a :href="provider.web_url" target="_blank">Ver</a>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup>
import { ref } from "vue";
import { useWatchmode } from "@/composables/useWatchmode";

const { searchMovie, getProviders } = useWatchmode();

const searchQuery = ref("");
const movies = ref([]);
const providers = ref([]);
const loading = ref(false);
const error = ref(null);

const handleSearch = async () => {
	loading.value = true;
	error.value = null;
	providers.value = []; // Limpiar proveedores
	try {
		movies.value = await searchMovie(searchQuery.value);
		if (movies.value.length === 0) {
			error.value = "No se encontraron resultados.";
		}
	} catch (e) {
		error.value = "Error al buscar la película.";
	} finally {
		loading.value = false;
	}
};

const fetchProviders = async (titleId) => {
	loading.value = true;
	error.value = null;
	try {
		providers.value = await getProviders(titleId);
		if (providers.value.length === 0) {
			error.value = "No hay proveedores disponibles para esta película.";
		}
	} catch (e) {
		error.value = "Error al obtener proveedores.";
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.error {
	color: red;
}
</style>
