<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Usamos ref para manejar los datos del formulario
const name = ref<string | null>(null);
const email = ref<string | null>(null);
const bio = ref<string | null>(null);
const favoriteMovies = ref<string[]>([]);

const router = useRouter();

// Cargar los datos del usuario para pre-poblar el formulario
onMounted(async () => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            console.log("no token, redirecting to login...");
            router.push("/");
            return;
        }

        try {
            const response = await fetch("/api/user.get", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const userData = await response.json();
            if (userData) {
                name.value = userData.name || null;
                email.value = userData.email || null;
                bio.value = userData.description || '';
                favoriteMovies.value = userData.favoriteMovies || [];
            }
        } catch (error) {
            console.error("Error al conectar con el backend:", error);
            router.push("/");
        }
    }
});

// Función para manejar la actualización de los datos
const updateProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        console.log("no token, redirecting to login...");
        router.push("/");
        return;
    }

    try {
        const response = await fetch("/api/user.get", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: name.value,
                email: email.value,
                description: bio.value,
                favoriteMovies: favoriteMovies.value,
            }),
        });

        if (response.ok) {
            console.log("Perfil actualizado correctamente");
            router.push("/profile"); // Redirigir al perfil o alguna otra página
        } else {
            console.error("Error al actualizar el perfil");
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
    }
};
</script>

<template>
    <div class="p-8 font-mono text-blue-900">
        <div class="bg-blue-200 p-8 w-[30%] rounded-xl text-lg opacity-90 mx-auto">
            <h2 class="text-2xl font-bold text-center">Editar Perfil</h2>

            <!-- Formulario de edición de perfil -->
            <form @submit.prevent="updateProfile">
                <div class="mt-4">
                    <label for="name" class="block">Nombre:</label>
                    <input type="text" id="name" v-model="name" class="w-full p-2 mt-1 border rounded"
                        placeholder="Nombre" />
                </div>

                <div class="mt-4">
                    <label for="email" class="block">Email:</label>
                    <input type="email" id="email" v-model="email" class="w-full p-2 mt-1 border rounded"
                        placeholder="Email" />
                </div>

                <div class="mt-4">
                    <label for="bio" class="block">Bio:</label>
                    <textarea id="bio" v-model="bio" class="w-full p-2 mt-1 border rounded"
                        placeholder="Descripción"></textarea>
                </div>

                <div class="mt-4">
                    <label for="favoriteMovies" class="block">Películas Favoritas:</label>
                    <input type="text" id="favoriteMovies" v-model="favoriteMovies[0]"
                        class="w-full p-2 mt-1 border rounded" placeholder="Ejemplo: El Padrino" />
                    <!-- Puedes añadir más campos para permitir añadir varias películas -->
                    <div v-for="(movie, index) in favoriteMovies" :key="index" class="mt-2">
                        <input type="text" v-model="favoriteMovies[index]" :placeholder="'Película ' + (index + 1)"
                            class="w-full p-2 mt-1 border rounded" />
                    </div>
                </div>

                <div class="mt-6 text-center">
                    <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                        Guardar Cambios
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
