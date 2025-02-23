<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = reactive<{
	name: string | null;
	email: string | null;
	id: string | null;
	profilePic: string | null;
	bio: string | null;
	favoriteMovies: string[];
}>({
	name: null,
	email: null,
	id: null,
	profilePic: null,
	bio: null,
	favoriteMovies: [],
});

const post = reactive<{
	title: string | null;
	content: string | null;
	createdAT: string | null;
	user: string | null;
}>({
	title: null,
	content: null,
	createdAT: null,
	user: null,
});

onMounted(async () => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("auth_token");
		console.log("Your token is =>", token);

		if (!token) {
			console.log("no token, go to login...");
			router.push("/");
			return;
		}

		try {
			const response = await fetch("/api/user", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			const userData = await response.json(); // Parseamos la respuesta a JSON

			console.log("Respuesta JSON del servidor:", userData);

			// Asignar directamente los datos del usuario
			if (userData) {
				user.name = userData.name;
				user.email = userData.email;
				user.id = userData.id;
				user.profilePic = userData.profilePic || null;
				user.bio = userData.description || '';  // Cambié 'description' por 'bio' (opcional)
				user.favoriteMovies = userData.favoriteMovies || [];

				console.log("Datos del usuario asignados:", user);
			} else {
				console.error("La respuesta no contiene los datos del usuario esperados");
			}
		} catch (error) {
			console.error("Error al conectar con el backend:", error);
			router.push("/");
		}
	}
});

const editProfile = () => {
	// Aquí podrías redirigir al usuario a una página de edición
	console.log("Editar perfil...");
	router.push("/editProfile"); // O la ruta que utilices para editar
};
</script>

<template>
	<div class="p-5 font-mono text-blue-900 justify-start items-start">
		<div class="bg-blue-200 p-8 w-[30%] rounded-xl text-lg opacity-90 h-full">
			<!-- Título de bienvenida -->
			<h1 v-if="user.name" class="text-center text-2xl font-bold">
				¡Welcome back <strong>{{ user.name }}</strong>!
			</h1>
			<p v-else class="text-center">Cargando datos del usuario...</p>

			<!-- Mostrar foto de perfil -->
			<div v-if="user.profilePic" class="mt-4 flex justify-center">
				<img :src="user.profilePic" alt="Foto de perfil" class="w-24 h-24 rounded-full" />
			</div>

			<!-- Mostrar bio -->
			<div v-show="user.bio !== null" class="mt-4 text-center">
				<p><strong>Bio:</strong> {{ user.bio || 'No ha proporcionado una descripción' }}</p>
			</div>

			<!-- Mostrar películas favoritas -->
			<div v-show="user.favoriteMovies.length >= 0" class="mt-4">
				<h3 class="font-bold">Películas Favoritas:</h3>
				<ul v-if="user.favoriteMovies.length > 0" class="list-disc ml-4">
					<li v-for="movie in user.favoriteMovies" :key="movie">{{ movie }}</li>
				</ul>
				<p v-else>No hay películas favoritas.</p>
			</div>



			<!-- Botón para editar -->
			<div class="mt-6 text-center">
				<button @click="editProfile" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
					Editar Perfil
				</button>
			</div>
		</div>
		<!-- Mostrar email -->
		<div v-show="user.email !== null" class="mt-4 text-center">
			<p><strong>Email:</strong> {{ user.email || 'No se ha proporcionado un email' }}</p>
		</div>
		<div class="mt-4 text-center">
			<p v-if="post.title"><strong>Título:</strong> {{ post.title }}</p>
			<p v-else>No se ha proporcionado un título</p>

			<p v-if="post.content"><strong>Contenido:</strong> {{ post.content }}</p>
			<p v-else>No se ha proporcionado contenido</p>
		</div>
	</div>
</template>
