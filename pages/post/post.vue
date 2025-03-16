<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const postList = ref([]);
const newPost = reactive({ title: "", content: "" });

// Estado para comentarios
const comments = ref<{ [key: number]: any[] }>({});
const newComment = reactive({ content: "", postId: null });

onMounted(async () => {
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
    <div class="p-5 font-mono text-blue-900">
        <div class="bg-blue-200 p-5 rounded-xl">
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

                <!-- Sección de comentarios -->
                <div class="mt-3">
                    <h4 class="font-bold">Comentarios</h4>

                    <ul>
                        <li v-for="comment in comments[p.id]" :key="comment.id">
                            <strong>{{ comment.user.name }}:</strong> {{ comment.content }}
                        </li>
                    </ul>

                    <input v-model="newComment.content" placeholder="Escribe un comentario..."
                        class="w-full p-2 border mt-2" />
                    <button @click="createComment(p.id)"
                        class="bg-blue-500 text-white p-2 rounded mt-2">Comentar</button>
                </div>
            </div>
        </div>
    </div>
</template>
