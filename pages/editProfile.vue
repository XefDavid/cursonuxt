<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const name = ref<string | null>(null);
const email = ref<string | null>(null);
const bio = ref<string | null>(null);
const favoriteMovies = ref<string[]>([]);
const profilePic = ref<File | null>(null);

const router = useRouter();

onMounted(async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        router.push("/");
        return;
    }

    try {
        const response = await fetch("/api/user", {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
        });

        const userData = await response.json();
        if (userData) {
            name.value = userData.name || null;
            email.value = userData.email || null;
            bio.value = userData.description || "";
            favoriteMovies.value = userData.favoriteMovies || [];
        }
    } catch (error) {
        console.error("Error al obtener datos del usuario:", error);
        router.push("/");
    }
});

const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) profilePic.value = file;
};

const updateProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        router.push("/");
        return;
    }

    const formData = new FormData();
    formData.append("name", name.value || "");
    formData.append("email", email.value || "");
    formData.append("description", bio.value || "");
    favoriteMovies.value.forEach((movie, index) => {
        formData.append(`favoriteMovies[${index}]`, movie);
    });
    if (profilePic.value) {
        formData.append("profilePic", profilePic.value);
    }

    try {
        const response = await fetch("/api/updateProfile", {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
        });

        if (response.ok) {
            router.push("/main");
        } else {
            console.error("Error al actualizar el perfil");
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
    }
};

const addFavoriteMovie = () => {
    favoriteMovies.value.push('');
};

const removeFavoriteMovie = (index: number) => {
    favoriteMovies.value.splice(index, 1);
};
</script>

<template>
    <div class="flex flex-col p-8 font-mono text-blue-900 bg-slate-900 gap-4">
        <div class="bg-blue-200 p-8 w-[30%] rounded-xl text-lg opacity-90 mx-auto">
            <h2 class="text-2xl font-bold text-center">Editar Perfil</h2>

            <form @submit.prevent="updateProfile">
                <div class="mt-4">
                    <label for="name">Nombre:</label>
                    <input type="text" id="name" v-model="name" class="w-full p-2 mt-1 border rounded" />
                </div>

                <div class="mt-4">
                    <label for="email">Email:</label>
                    <input type="email" id="email" v-model="email" class="w-full p-2 mt-1 border rounded" />
                </div>

                <div class="mt-4">
                    <label for="bio">Bio:</label>
                    <textarea id="bio" v-model="bio" class="w-full p-2 mt-1 border rounded"></textarea>
                </div>

                <div class="mt-4">
                    <label for="profilePic">Imagen de Perfil:</label>
                    <input type="file" id="profilePic" @change="handleFileChange" accept="image/*"
                        class="w-full p-2 mt-1 border rounded" />
                </div>

                <div class="mt-4">
                    <label>Películas Favoritas:</label>
                    <div v-for="(movie, index) in favoriteMovies" :key="index" class="mt-2">
                        <input v-model="favoriteMovies[index]" class="w-full p-2 mt-1 border rounded" />
                        <button type="button" @click="removeFavoriteMovie(index)"
                            class="text-red-500 mt-1">Eliminar</button>
                    </div>
                    <button type="button" @click="addFavoriteMovie" class="text-blue-500 mt-2">Agregar otra
                        película</button>
                </div>

                <div class="mt-6 text-center">
                    <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">Guardar
                        Cambios</button>
                </div>
            </form>
        </div>
    </div>
</template>
