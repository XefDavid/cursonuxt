<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import Navbar from "./navbar.vue";

const router = useRouter();

// Definir un ref para almacenar los datos del usuario
const user = ref<{
	name: string | null;
	email: string | null;
	id: string | null;
}>({
	name: null,
	email: null,
	id: null,
});

// Leer el token y el usuario desde localStorage al montar el componente
onMounted(async () => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("auth_token");
		console.log("Token recuperado:", token);

		if (!token) {
			console.log("No hay token, redirigiendo al login...");
			router.push("/"); // Si no hay token, redirigir al login
			return;
		}

		try {
			// Hacer la solicitud al backend (Nuxt API)
			const response = await fetch("/api/user", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`, // Enviar el token en el header
				},
			});

			// Verificar el estado de la respuesta
			console.log("Respuesta recibida:", response);

			if (!response.ok) {
				console.error(
					"Error al obtener los datos del usuario:",
					response.statusText
				);
				router.push("/"); // Redirigir si hay un error
				return;
			}

			// Parsear la respuesta y actualizar los datos del usuario
			const userData = await response.json();

			// Imprimir toda la respuesta para verificar la estructura
			console.log("Datos completos del usuario recibidos:", userData);

			// Verifica si la respuesta tiene la estructura correcta
			if (userData && userData.body) {
				// Esto es para mostrar la estructura completa de la respuesta
				console.log("Estructura de los datos:", userData.body);

				// Asignar los datos a user.value
				user.value.name = userData.body.name;
				user.value.email = userData.body.email;
				user.value.id = userData.body.id;

				console.log("Datos del usuario asignados:", user.value);
			} else {
				console.error(
					"La respuesta no contiene los datos del usuario esperados"
				);
			}
		} catch (error) {
			console.error("Error al conectar con el backend:", error);
			router.push("/"); // Redirigir en caso de error
		}
	}
});

// Función para manejar el logout
const handleLogout = () => {
	console.log("Cerrando sesión...");
	localStorage.removeItem("auth_token"); // Eliminar el token
	localStorage.removeItem("user"); // Eliminar los datos del usuario
	router.push("/"); // Redirigir al login
};
</script>

<template>
	<div>
		<Navbar />
		<!-- Mostrar el nombre del usuario si existe -->
		{{ console.log(user) }}
		<h1 v-if="user.value?.name">¡Bienvenido {{ user.value.name }}!</h1>

		<p v-else>Cargando datos del usuario...</p>

		<!-- Botón de logout -->
		<button
			@click="handleLogout"
			class="text-blue-500 border border-blue-600 rounded-xl p-2 font-mono !flex !justify-center bg-blue-50"
		>
			Logout
		</button>
	</div>
</template>
