<script setup>
import MovieSearch from "~/components/Streaming/MovieSearchStreaming.vue";
import navbar from "~/components/navbar.vue";
</script>
<template>
	<div
		id="imageBackground"
		class="aspect-[16/9] w-screen bg-cover bg-center border-[5px] border-blue-500 gap-5"
		:style="{ backgroundImage: `url('/images/background.webp')` }"
	>
		<div>
			<navbar />
			<MovieSearch />
		</div>
	</div>
</template>
