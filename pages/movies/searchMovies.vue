<script setup lang="ts">
import { onMounted } from "vue";
import SearchMovies from "~/components/Searchmovies.vue";
import navbar from "~/components/navbar.vue";
onMounted(() => {
	const token = localStorage.getItem("auth_token");

	if (!token) {
		console.log("🔒 No estás autenticado. Redirigiendo al login...");
		router.push("/"); // Redirige al login si no hay token
	}
});
</script>

<template>
	<div id="imageBackground" class="aspect-[16/9] w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
		:style="{ backgroundImage: `url('/images/background.webp')` }">
		<div>
			<navbar />
			<SearchMovies />
		</div>
	</div>
</template>
