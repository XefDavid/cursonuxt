<template>
	<div class="news-search">
		<h2 class="text-xl font-bold mb-4">Buscar Noticias de Cine</h2>

		<form @submit.prevent="onSearch">
			<div class="mb-4">
				<label for="language" class="block font-medium"
					>Seleccionar Idioma:</label
				>
				<select
					v-model="language"
					id="language"
					class="border rounded px-4 py-2 w-full"
				>
					<option value="en">Inglés</option>
					<option value="es">Español</option>
					<option value="fr">Francés</option>
					<option value="de">Alemán</option>
				</select>
			</div>

			<button
				type="submit"
				class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
			>
				Buscar
			</button>
		</form>

		<div v-if="loading" class="mt-4 text-blue-500">Cargando noticias...</div>
		<div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
		<div v-if="news.length" class="mt-6">
			<h3 class="text-lg font-semibold mb-2">Resultados:</h3>
			<ul>
				<li
					v-for="article in news"
					:key="article.url"
					class="mb-4 flex items-start gap-4"
				>
					<img
						v-if="article.urlToImage"
						:src="article.urlToImage"
						alt="Imagen de la noticia"
						class="w-24 h-24 object-cover rounded-md"
					/>
					<div>
						<a
							:href="article.url"
							target="_blank"
							class="text-blue-600 hover:underline"
						>
							{{ article.title }}
						</a>
						<p class="text-sm text-gray-600">{{ article.description }}</p>
					</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import useNewsApi from "~/composables/useNewsApi";

// Variable reactiva para el idioma
const language = ref("en");

// Usar el composable
const { news, loading, error, fetchCinemaNews } = useNewsApi();

// Función para manejar la búsqueda
const onSearch = async () => {
	await fetchCinemaNews(language.value, "defaultSecondArgument");
};
</script>

<style scoped>
.news-search {
	max-width: 600px;
	margin: auto;
}
</style>
