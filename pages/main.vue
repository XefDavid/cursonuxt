<script setup lang="ts">
import mainUserMenu from "~/components/MainComponents/mainUserMenu.vue";

definePageMeta({
	middleware: "auth",
});
</script>

<template>
	<div>
		<mainUserMenu />
	</div>
</template>
