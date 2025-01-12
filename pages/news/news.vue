<script setup lang="ts">
import Navbar from "~/components/navbar.vue";
import newsMain from "~/components/news/newsSearch.vue";
</script>

<template>
	<div
		id="imageBackground"
		class="aspect-[16/9] w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
		:style="{ backgroundImage: `url('/images/background.webp')` }"
	>
		<Navbar />
		<newsMain />
	</div>
</template>
