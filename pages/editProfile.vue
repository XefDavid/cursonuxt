<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

// Usamos ref para manejar los datos del formulario
const name = ref<string | null>(null);
const email = ref<string | null>(null);
const bio = ref<string | null>(null);
const favoriteMovies = ref<string[]>([]);

const router = useRouter();

onMounted(async () => {
    console.log("Cargando datos del usuario...");
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            console.error("No token found, redirecting to login");
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

            console.log("Respuesta del servidor (GET user):", response);

            const userData = await response.json();
            if (userData) {
                console.log("Datos del usuario cargados:", userData);
                name.value = userData.name || null;
                email.value = userData.email || null;
                bio.value = userData.description || "";
                favoriteMovies.value = userData.favoriteMovies || [];
            }
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
            router.push("/");
        }
    }
});

const updateProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        console.log("no token, redirecting to login...");
        router.push("/");
        return;
    }

    const dataToSend = {
        name: name.value,
        email: email.value,
        description: bio.value,
        favoriteMovies: favoriteMovies.value,
    };

    console.log("Datos enviados al backend:", dataToSend);

    try {
        const response = await fetch("/api/updateProfile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
            console.log("Perfil actualizado correctamente");
            router.push("/main"); // Redirigir al perfil o alguna otra página
        } else {
            console.error("Error al actualizar el perfil");
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
    }
};



// Función para agregar más campos de películas favoritas
const addFavoriteMovie = () => {
    favoriteMovies.value.push('');
};

// Función para eliminar una película favorita
const removeFavoriteMovie = (index: number) => {
    favoriteMovies.value.splice(index, 1);
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
                    <!-- Mostrar campos dinámicamente para películas favoritas -->
                    <div v-for="(movie, index) in favoriteMovies" :key="index" class="mt-2">
                        <input v-model="favoriteMovies[index]" :placeholder="'Película ' + (index + 1)"
                            class="w-full p-2 mt-1 border rounded" />
                        <button type="button" @click="removeFavoriteMovie(index)" class="text-red-500 mt-1">
                            Eliminar
                        </button>
                    </div>

                    <button type="button" @click="addFavoriteMovie" class="text-blue-500 mt-2">
                        Agregar otra película
                    </button>
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
