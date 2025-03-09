<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import useNewsApi from "~/composables/useNewsApi";

// ⚡ Instancia del router
const router = useRouter();

// 🔐 Verifica si el usuario está autenticado
onMounted(() => {
	const token = localStorage.getItem("auth_token");

	if (!token) {
		console.log("🔒 No estás autenticado. Redirigiendo al login...");
		router.push("/"); // Redirige al login si no hay token
	}
});

// Variable reactiva para el idioma
const language = ref("");

// Usar el composable
const { news, loading, error, fetchCinemaNews } = useNewsApi();

// Función para manejar la búsqueda
const onSearch = async () => {
	await fetchCinemaNews(language.value, "defaultSecondArgument");
};
</script>

<template>
	<div class="flex flex-col items-center justify-start pt-10 h-[100vh] overflow-auto">
		<h1 class="text-5xl font-bold font-mono text-stroke-yellow w-full p-8 text-center">
			Search for cinema news
		</h1>
		<form @submit.prevent="onSearch" class="flex flex-row gap-2 rounded-xl pt-7 font-mono">
			<div class="mb-4">
				<select v-model="language" id="language"
					class="border border-black rounded-xl w-60 text-sm text-center h-8">
					<option value="" disabled selected>Choose a language</option>
					<option value="en">Inglés</option>
					<option value="es">Español</option>
					<option value="fr">Francés</option>
					<option value="de">Alemán</option>
				</select>
			</div>

			<button type="submit" class="rounded-xl w-20 h-8" :class="{
				'bg-gray-300': !language,
				'bg-blue-400': language,
				'border border-blue-500': language,
			}">
				Buscar
			</button>
		</form>

		<div v-if="loading" class="mt-4 text-blue-500">Cargando noticias...</div>
		<div v-if="error" class="mt-4 text-red-500">{{ error }}</div>
		<div v-if="news.length" class="mt-6">
			<div class="flex flex-col items-center justify-center font-mono">
				<ul class="w-[50%] rounded-md border border-black gap-4">
					<li v-for="article in news" :key="article.url"
						class="mb-2 p-2 flex items-start bg-blue-100 rounded-lg">
						<img v-if="article.urlToImage" :src="article.urlToImage" alt="Imagen de la noticia"
							class="w-24 h-24 object-cover rounded-md p-1 border border-black" />
						<div class="p-4">
							<a :href="article.url" target="_blank"
								class="text-blue-600 hover:underline text-sm font-semibold">
								{{ article.title }}
							</a>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<style scoped>
.text-stroke-yellow {
	-webkit-text-stroke: 1px #e4c05f;
	-webkit-text-fill-color: #1e3a8a;
}
</style>
