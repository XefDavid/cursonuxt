<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const user = reactive({
	name: null,
	email: null,
	id: null,
	profilePic: null,
	bio: null,
	favoriteMovies: [],
});

const postList = ref([]);
const newPost = reactive({ title: "", content: "" });

onMounted(async () => {
	const token = localStorage.getItem("auth_token");

	if (!token) {
		console.log("No token found, redirecting...");
		return;
	}

	// Obtener usuario autenticado
	try {
		const response = await fetch("/api/user", {
			method: "GET",
			headers: { Authorization: `Bearer ${token}` },
		});

		const userData = await response.json();
		if (userData) {
			user.name = userData.name;
			user.email = userData.email;
			user.id = userData.id;
			user.profilePic = userData.profilePic || "/images/defaultProfilePic.jpg";
			user.bio = userData.description || "";
			user.favoriteMovies = userData.favoriteMovies || [];
		}
	} catch (error) {
		console.error("Error al obtener usuario:", error);
	}

	// Obtener posts
	await fetchPosts();
});

const fetchPosts = async () => {
	try {
		const response = await fetch("/api/posts");
		postList.value = await response.json();
	} catch (error) {
		console.error("Error cargando posts:", error);
	}
};

const createPost = async () => {
	const token = localStorage.getItem("auth_token");

	if (!token) {
		alert("Debes iniciar sesión");
		return;
	}
	console.log("Enviando post:", newPost);
	console.log("Token usado:", token);

	try {
		await fetch("/api/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify(newPost),
		});

		alert("Post creado");
		newPost.title = "";
		newPost.content = "";
		await fetchPosts();
	} catch (error) {
		console.error("Error creando post:", error);
	}
};

</script>

<template>
	<div class="p-5 font-mono text-blue-900">
		<div class="bg-blue-200 p-5 w-[30%] rounded-xl text-lg">
			<h1 v-if="user.name" class="text-center text-2xl font-bold">
				¡Welcome back <strong>{{ user.name }}</strong>!
			</h1>
			<p v-else>Cargando datos del usuario...</p>

			<div v-if="user.profilePic" class="mt-4 flex justify-center">
				<img :src="user.profilePic" class="w-24 h-24 rounded-xl" />
			</div>

			<h3 class="mt-4 font-bold underline">Bio:</h3>
			<p>{{ user.bio || "No ha proporcionado una descripción" }}</p>

			<h3 class="mt-4 font-bold underline">Películas Favoritas:</h3>
			<ul v-if="user.favoriteMovies.length">
				<li v-for="movie in user.favoriteMovies" :key="movie.id">{{ movie.title }}</li>
			</ul>
			<p v-else>No hay películas favoritas.</p>
		</div>

		<div class="bg-blue-200 p-5 w-full rounded-xl">
			<h2 class="text-xl font-bold">Crear nuevo post</h2>
			<form @submit.prevent="createPost">
				<input v-model="newPost.title" placeholder="Título" required class="w-full mb-2 p-2 border" />
				<textarea v-model="newPost.content" placeholder="Contenido" required
					class="w-full mb-2 p-2 border"></textarea>
				<button type="submit" class="bg-blue-500 text-white p-2 rounded">Publicar</button>
			</form>

			<h2 class="text-xl font-bold mt-5">Posts recientes</h2>
			<div v-for="p in postList" :key="p.id" class="p-4 border mt-3">
				<h3 class="font-bold">{{ p.title }}</h3>
				<p>{{ p.content }}</p>
				<small>Publicado por: {{ p.user.name }}</small>
			</div>
		</div>
	</div>
</template>
