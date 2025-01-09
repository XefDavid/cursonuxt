<script setup lang="ts">
import { onMounted } from "vue";
import { useGeoLocation } from "~/composables/useGeoLocation";
import { useWeather } from "~/composables/useWeather";
import { useRouter } from "vue-router";

const router = useRouter();

const { geolocationData, errorMessage, fetchGeolocation } = useGeoLocation();

const {
	weatherData,
	errorMessage: weatherErrorMessage,
	fetchWeather,
} = useWeather();

onMounted(async () => {
	await fetchGeolocation();
	if (geolocationData.value) {
		const { latitude, longitude } = geolocationData.value;
		await fetchWeather(latitude, longitude);
	}
});

const handleLogout = () => {
	localStorage.removeItem("auth_token");
	localStorage.removeItem("user");
	router.push("/");
};
</script>

<template>
	<div class="text-blue-900">
		<div
			class="flex flex-row items-center text-sm h-14 w-full bg-blue-300 p-5 opacity-90"
		>
			<img src="~/assets/images/logo.webp" alt="log" class="size-11" />
			<h1
				class="text-3xl font-bold font-mono text-stroke-yellow w-full text-start pl-6"
			>
				Movies World
			</h1>
			<div
				v-if="weatherData && geolocationData"
				class="flex flex-row items-center justify-end w-full pr-3"
			>
				<img
					:src="weatherData.current.condition.icon"
					:alt="weatherData.current.condition.text"
					class="size-10"
				/>
				{{ weatherData.current.temp_c }}°C {{ geolocationData.city }} ,
				{{ geolocationData.country }}
				<p v-if="!weatherData && !errorMessage">searching weather data...</p>
				<p v-if="errorMessage || weatherErrorMessage" class="text-red-500">
					{{ errorMessage || weatherErrorMessage }}
				</p>
			</div>
			<button
				@click="handleLogout"
				class="rounded-xl w-20 p-2 boder font-bold bg-blue-100"
			>
				Logout
			</button>
		</div>
		<div class="flex flex-row bg-blue-200 h-10 items-center text-sm opacity-90">
			<nuxt-link to="/movies/searchMovies" class="p-3 hover:underline">
				Search Info
			</nuxt-link>
		</div>
	</div>
</template>
