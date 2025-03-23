<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";

const postList = ref([]);
const newPost = reactive({ title: "", content: "" });
const comments = ref<{ [key: number]: any[] }>({});
const newComment = reactive({ content: "", postId: null });
const errorMessage = ref("");

onMounted(async () => {
    await fetchPosts();
});

const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>?/g, "").trim();
};

const fetchPosts = async () => {
    try {
        const response = await fetch("/api/posts");
        postList.value = await response.json();

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

    // Sanitizar y validar datos
    const sanitizedTitle = sanitizeInput(newPost.title);
    const sanitizedContent = sanitizeInput(newPost.content);

    if (!sanitizedTitle || !sanitizedContent) {
        errorMessage.value = "El título y el contenido no pueden estar vacíos.";
        return;
    }

    if (sanitizedTitle.length > 100) {
        errorMessage.value = "El título no puede superar los 100 caracteres.";
        return;
    }

    if (sanitizedContent.length > 500) {
        errorMessage.value = "El contenido no puede superar los 500 caracteres.";
        return;
    }

    try {
        await fetch("/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ title: sanitizedTitle, content: sanitizedContent }),
        });

        alert("Post creado");
        newPost.title = "";
        newPost.content = "";
        errorMessage.value = "";
        await fetchPosts();
    } catch (error) {
        console.error("Error creando post:", error);
    }
};

const fetchComments = async (postId: number) => {
    try {
        const response = await fetch(`/api/comments?postId=${postId}`);
        comments.value[postId] = await response.json();
    } catch (error) {
        console.error("Error cargando comentarios:", error);
    }
};

const createComment = async (postId: number) => {
    const token = localStorage.getItem("auth_token");

    if (!token) {
        alert("Debes iniciar sesión");
        return;
    }

    // Sanitizar y validar comentario
    const sanitizedComment = sanitizeInput(newComment.content);

    if (!sanitizedComment) {
        errorMessage.value = "El comentario no puede estar vacío.";
        return;
    }

    if (sanitizedComment.length > 300) {
        errorMessage.value = "El comentario no puede superar los 300 caracteres.";
        return;
    }

    try {
        await fetch("/api/comments", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ content: sanitizedComment, postId }),
        });

        newComment.content = "";
        errorMessage.value = "";
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
                <input v-model="newPost.title" placeholder="Título" required maxlength="100"
                    class="w-full mb-2 p-2 border" />
                <textarea v-model="newPost.content" placeholder="Contenido" required maxlength="500"
                    class="w-full mb-2 p-2 border"></textarea>
                <button type="submit" class="bg-blue-500 text-white p-2 rounded">Publicar</button>
            </form>

            <p v-if="errorMessage" class="text-red-700 mt-2">{{ errorMessage }}</p>

            <h2 class="text-xl font-bold mt-5">Posts recientes</h2>
            <div v-for="p in postList" :key="p.id" class="p-4 border mt-3">
                <h3 class="font-bold">{{ p.title }}</h3>
                <p>{{ p.content }}</p>
                <small>Publicado por: {{ p.user.name }}</small>

                <div class="mt-3">
                    <h4 class="font-bold">Comentarios</h4>

                    <ul>
                        <li v-for="comment in comments[p.id]" :key="comment.id">
                            <strong>{{ comment.user.name }}:</strong> {{ comment.content }}
                        </li>
                    </ul>

                    <input v-model="newComment.content" placeholder="Escribe un comentario..." maxlength="300"
                        class="w-full p-2 border mt-2" />
                    <button @click="createComment(p.id)"
                        class="bg-blue-500 text-white p-2 rounded mt-2">Comentar</button>
                </div>
            </div>
        </div>
    </div>
</template>
