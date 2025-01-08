<script setup lang="ts">
import mainUserMenu from "~/components/mainUserMenu.vue";

definePageMeta({
	middleware: "auth",
});
</script>

<template>
	<div>
		<mainUserMenu />
	</div>
</template>
