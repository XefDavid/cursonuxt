<script setup lang="ts">
import Billboard from "~/components/Billboard/Billboard.vue";
import Navbar from "~/components/navbar.vue";
</script>

<template>
	<div id="imageBackground" class="aspect-[16/9] w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
		:style="{ backgroundImage: `url('/images/background.webp')` }">
		<Navbar />
		<Billboard />
	</div>
</template>
