<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const name = ref<string | null>(null);
const email = ref<string | null>(null);
const bio = ref<string | null>(null);
const favoriteMovies = ref<string[]>([]);
const profilePic = ref<File | null>(null);
const errorMessage = ref("");

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

// Sanitización de entrada para evitar inyección de scripts
const sanitizeInput = (input: string) => {
    return input.replace(/<[^>]*>?/g, "").trim();
};

const handleFileChange = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
        // Validar tipo de imagen
        if (!file.type.startsWith("image/")) {
            errorMessage.value = "Por favor, selecciona un archivo de imagen válido.";
            return;
        }

        // Validar tamaño de la imagen (Máx: 2MB)
        if (file.size > 2 * 1024 * 1024) {
            errorMessage.value = "El tamaño de la imagen no debe superar los 2MB.";
            return;
        }

        profilePic.value = file;
        errorMessage.value = "";
    }
};

const updateProfile = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        router.push("/");
        return;
    }

    // Sanitizar entradas
    const sanitizedName = sanitizeInput(name.value || "");
    const sanitizedBio = sanitizeInput(bio.value || "");
    const sanitizedMovies = favoriteMovies.value.map((movie) => sanitizeInput(movie));

    // Validaciones
    if (!sanitizedName || sanitizedName.length > 50) {
        errorMessage.value = "El nombre es obligatorio y no debe superar los 50 caracteres.";
        return;
    }

    if (sanitizedBio.length > 300) {
        errorMessage.value = "La biografía no puede superar los 300 caracteres.";
        return;
    }

    if (sanitizedMovies.some((movie) => movie.length > 100)) {
        errorMessage.value = "Cada película no puede superar los 100 caracteres.";
        return;
    }

    const formData = new FormData();
    formData.append("name", sanitizedName);
    formData.append("email", email.value || "");
    formData.append("description", sanitizedBio);
    sanitizedMovies.forEach((movie, index) => {
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
            errorMessage.value = "No se pudo actualizar el perfil. Intenta de nuevo.";
        }
    } catch (error) {
        console.error("Error al conectar con el backend:", error);
        errorMessage.value = "Error de conexión con el servidor.";
    }
};

const addFavoriteMovie = () => {
    if (favoriteMovies.value.length < 5) {
        favoriteMovies.value.push("");
    } else {
        errorMessage.value = "No puedes agregar más de 5 películas favoritas.";
    }
};

const removeFavoriteMovie = (index: number) => {
    favoriteMovies.value.splice(index, 1);
};
</script>

<template>
    <div id="imageBackground" class="aspect-[16/9] w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
        :style="{ backgroundImage: `url('/images/background.webp')` }">
        <Navbar />
        <div class="flex flex-col p-8 font-mono text-blue-900  gap-4">
            <div class="bg-blue-200 p-8 w-[30%] rounded-xl text-lg opacity-90 mx-auto">
                <h2 class="text-2xl font-bold text-center">Editar Perfil</h2>

                <form @submit.prevent="updateProfile">
                    <div class="mt-4">
                        <label for="name">Nombre:</label>
                        <input type="text" id="name" v-model="name" maxlength="50"
                            class="w-full p-2 mt-1 border rounded" />
                    </div>

                    <div class="mt-4">
                        <label for="email">Email:</label>
                        <input type="email" id="email" v-model="email" class="w-full p-2 mt-1 border rounded"
                            readonly />
                    </div>

                    <div class="mt-4">
                        <label for="bio">Bio:</label>
                        <textarea id="bio" v-model="bio" maxlength="300"
                            class="w-full p-2 mt-1 border rounded"></textarea>
                    </div>

                    <div class="mt-4">
                        <label for="profilePic">Imagen de Perfil:</label>
                        <input type="file" id="profilePic" @change="handleFileChange" accept="image/*"
                            class="w-full p-2 mt-1 border rounded" />
                    </div>

                    <div class="mt-4">
                        <label>Películas Favoritas:</label>
                        <div v-for="(movie, index) in favoriteMovies" :key="index" class="mt-2">
                            <input v-model="favoriteMovies[index]" maxlength="100"
                                class="w-full p-2 mt-1 border rounded" />
                            <button type="button" @click="removeFavoriteMovie(index)"
                                class="text-red-500 mt-1">Eliminar</button>
                        </div>
                        <button type="button" @click="addFavoriteMovie" class="text-blue-500 mt-2">Agregar otra
                            película</button>
                    </div>

                    <p v-if="errorMessage" class="text-red-700 mt-2">{{ errorMessage }}</p>

                    <div class="mt-6 text-center">
                        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
