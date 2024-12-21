<template>
	<div class="flex justify-center items-center pt-24 flex-col gap-2">
		<nav
			class="flex gap-12 flex-row h-full bg-blue-400 w-96 justify-center rounded-xl border border-blue-800"
		>
			<NuxtLink to="/">Home</NuxtLink>
			<NuxtLink to="/movies">Movies</NuxtLink>
		</nav>
		<NuxtPage />
	</div>
</template>
