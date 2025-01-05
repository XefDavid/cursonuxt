<script setup lang="ts">
import { ref, onMounted } from "vue";
import loginForm from "~/components/LoginForm.vue";

// Definir las referencias
const username = ref("");
const email = ref("");

// Definir el título de la página
useHead({
	title: "Login",
});

// Imprimir valores de las referencias al montarse el componente
onMounted(() => {
	console.log("Componente montado, valores iniciales:");
	console.log("username:", username.value);
	console.log("email:", email.value);
});

// Monitorear cambios en las referencias y loguearlos
watch([username, email], () => {
	console.log("Valores actualizados:");
	console.log("username:", username.value);
	console.log("email:", email.value);
});
</script>

<template>
	<div class="border border-blue-500">
		<loginForm />
	</div>
</template>
