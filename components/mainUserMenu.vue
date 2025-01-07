<script setup lang="ts">
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";

const router = useRouter();

const user = ref<User>(() => {
	const storedUser = localStorage.getItem("user");
	if (storedUser) {
		return JSON.parse(storedUser);
	} else {
		return { name: null, email: null, id: null };
	}
});

onMounted(() => {
	console.log("Usuario logeado en onmounted:", user.value.name);
});

// Función para manejar el logout
const handleLogout = () => {
	console.log("Cerrando sesión...");

	// Vaciar el estado global de 'user'
	user.value = { name: null, email: null, id: null };

	// Redirigir a la página de inicio
	router.push("/");
};

onMounted(() => {
	console.log("Usuario logeado:", user.value); // Verificamos el estado inicial de 'user'
});
</script>

<template>
	<div>
		<h1>¡Bienvenido {{ user.value?.name }}!</h1>
		<!-- Mostramos el nombre del usuario -->
	</div>
	<button @click="handleLogout">Logout</button>
	<!-- Botón de logout -->
</template>
