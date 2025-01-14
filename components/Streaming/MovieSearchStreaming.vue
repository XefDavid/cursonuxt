<script setup lang="ts">
import { useWatchmode } from "@/composables/useWatchmode";
import { ref } from "vue";

const { getProviders } = useWatchmode();
const query = ref("");
interface Movie {
	imdbID: string;
	Title: string;
	Year: string;
	Poster: string;
	providers: {
		name: string; // Cambiado a `string` para flexibilidad
		logo_url?: string;
		web_url?: string;
		source_id: string;
	}[];
}

const movies = ref<Movie[]>([]);
const loading = ref(false);
const error = ref(null);

const platformLogos = {
	Netflix: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
	"Disney+": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg",
	Amazon: "https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png",
	HBO: "https://upload.wikimedia.org/wikipedia/commons/1/17/HBO_Max_Logo.svg",
	Hulu: "https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg",
	"Rakuten TV": "https://upload.wikimedia.org/wikipedia/commons/1/16/Rakuten_TV_logo.svg",
	AppleTV: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Apple_TV.svg/512px-Apple_TV.svg.png?20230121010754",
	"Movistar+ ": "https://upload.wikimedia.org/wikipedia/commons/2/20/Logo_Movistar_%282%29.svg",
	FILMIN: "https://upload.wikimedia.org/wikipedia/commons/4/4b/Filmin_logo.svg",
};

// Buscar un logo dinámicamente (sin necesidad de mapeos manuales)
const getLogoForProvider = (name: string): string => {
	const normalizedKeys = Object.keys(platformLogos).map((key) => key.toLowerCase());
	const index = normalizedKeys.indexOf(name.toLowerCase());

	if (index !== -1) {
		const matchedKey = Object.keys(platformLogos)[index];
		return platformLogos[matchedKey];
	}

	// Fallback para proveedores desconocidos
	return "https://via.placeholder.com/30";
};

const {
	public: { omdbApiKey },
} = useRuntimeConfig();

const handleSearch = async () => {
	loading.value = true;
	error.value = null;
	movies.value = [];

	try {
		// Buscar películas en OMDb
		const { Search } = await $fetch(
			`http://www.omdbapi.com/?apikey=${omdbApiKey}&s=${query.value}`
		);

		if (!Search || Search.length === 0) {
			error.value = "No se encontraron resultados.";
			return;
		}

		// Enriquecer cada película con proveedores
		const enrichedMovies = await Promise.all(
			Search.map(async (movie) => {
				const providers: {
					name: string;
					logo_url?: string;
					web_url?: string;
					source_id: string;
				}[] = await getProviders(movie.imdbID);

				return {
					...movie,
					providers: Array.isArray(providers)
						? providers.map((provider) => ({
							...provider,
							logo_url: getLogoForProvider(provider.name), // Llamar a la función para cada proveedor
						}))
						: [],
				};
			})
		);

		movies.value = enrichedMovies;
	} catch (e) {
		console.error("Error al buscar películas o proveedores:", e);
		error.value = "Error al buscar películas o proveedores.";
	} finally {
		loading.value = false;
	}
};
</script>


<template>
	<div class="flex flex-col items-center justify-start pt-10 h-[100vh] overflow-auto font-mono">
		<h1 class="text-5xl font-bold font-mono text-stroke-yellow w-full p-8 text-center">
			Watch Your Favorite Movies
		</h1>
		<form class="flex flex-row gap-2 rounded-xl pt-7" @submit.prevent="handleSearch">
			<input type="text" v-model="query" class="border border-black rounded-xl w-60 text-sm text-center h-8"
				placeholder="Search your favorite films" />
			<button class="rounded-xl w-20" :class="{
				'bg-gray-300': !query,
				'bg-blue-400': query,
				'border border-blue-500': query,
			}">
				Search
			</button>
		</form>

		<div v-if="loading" class="text-center text-gray-500">Cargando...</div>
		<div v-if="error" class="text-center text-red-500">{{ error }}</div>

		<ul class="justify-center flex flex-col gap-4 w-[70%] pt-10">
			<li v-for="movie in movies" :key="movie.imdbID"
				class="border border-black flex flex-col items-center justify-start size-25 bg-blue-100 rounded-xl">
				<img :src="movie.Poster || 'https://via.placeholder.com/300x400'" alt="Poster"
					class="w-[100px] h-[100px] mb-2 rounded-md" />
				<p class="text-center text-normal text-gray-700 font-mono font-extrabold w-[250px] pb-4">
					{{ movie.Title }} ({{ movie.Year }})
				</p>

				<div class="flex flex-col items-start gap-2">
					<h2 class="text-gray-800 font-semibold text-lg">
						Streaming Providers
					</h2>
					<ul>
						<li v-for="provider in movie.providers" :key="provider.source_id"
							class="flex items-center gap-2 mb-2">
							<img :src="provider.logo_url" alt="Logo de la plataforma" class="w-8 h-8" />
							<a v-if="provider.web_url" :href="provider.web_url" target="_blank"
								class="text-blue-500 underline">
								{{ provider.name }}
							</a>
						</li>
					</ul>
				</div>
			</li>
		</ul>
	</div>
</template>

<style scoped>
.text-stroke-yellow {
	-webkit-text-stroke: 1px #e4c05f;
	-webkit-text-fill-color: #1e3a8a;
}
</style>
