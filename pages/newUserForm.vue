<script setup lang="ts">
import newUserForm from "~/components/newUserForm.vue";

// Establecer el título de la página
useHead({
	title: "Create a new user",
});

// Agregar un log para verificar que el componente está cargado
console.log("Página para crear un nuevo usuario cargada.");
</script>

<template>
	<div
		id="imageBackground"
		class="flex flex-col items-center justify-center h-screen w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
		:style="{ backgroundImage: `url('/images/background.webp')` }"
	>
		<h1 class="text-6xl font-bold font-mono text-blue-900 text-stroke-yellow">
			Create a new user
		</h1>

		<newUserForm />
	</div>
</template>
