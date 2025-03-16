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

// Estado para comentarios
const comments = ref<{ [key: number]: any[] }>({});
const newComment = reactive({ content: "", postId: null });

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

		// Obtener comentarios de cada post
		for (const post of postList.value) {
			await fetchComments(post.id);
		}
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

// Obtener comentarios de un post
const fetchComments = async (postId: number) => {
	try {
		const response = await fetch(`/api/comments?postId=${postId}`);
		comments.value[postId] = await response.json();
	} catch (error) {
		console.error("Error cargando comentarios:", error);
	}
};

// Crear un nuevo comentario
const createComment = async (postId: number) => {
	const token = localStorage.getItem("auth_token");

	if (!token) {
		alert("Debes iniciar sesión");
		return;
	}

	try {
		await fetch("/api/comments", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${token}`,
			},
			body: JSON.stringify({ content: newComment.content, postId }),
		});

		newComment.content = "";
		await fetchComments(postId);
	} catch (error) {
		console.error("Error creando comentario:", error);
	}
};
</script>

<template>
	<div class="p-5 font-mono text-blue-900 flex">
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


	</div>
</template>
