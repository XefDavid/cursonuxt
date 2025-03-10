<script setup lang="ts">
import mainUserMenu from "~/components/MainComponents/mainUserMenu.vue";

definePageMeta({
	middleware: "auth",
});
</script>

<template>
	<div id="imageBackground" class="aspect-[16/9] w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
		:style="{ backgroundImage: `url('/images/background.webp')` }">
		<mainUserMenu />
	</div>
</template>
