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
	<div>
		<!-- Insertamos el componente de creación de nuevo usuario -->
		<newUserForm />
	</div>
</template>
