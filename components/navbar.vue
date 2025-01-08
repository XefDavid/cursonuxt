<script setup lang="ts">
import { onMounted } from "vue";
import { useGeoLocation } from "~/composables/useGeoLocation";
import { useWeather } from "~/composables/useWeather";

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
</script>

<template>
	<div>
		<div
			v-if="weatherData && geolocationData"
			class="flex flex-row items-center text-sm h-14 w-full bg-blue-200 text-blue-800 p-4 justify-end"
		>
			<img
				:src="weatherData.current.condition.icon"
				:alt="weatherData.current.condition.text"
				class="size-10"
			/>
			{{ weatherData.current.temp_c }}°C {{ geolocationData.city }} ,
			{{ geolocationData.country }}
			<h1></h1>
			<p v-if="!weatherData && !errorMessage">Cargando datos del clima...</p>
			<p v-if="errorMessage || weatherErrorMessage" class="text-red-500">
				{{ errorMessage || weatherErrorMessage }}
			</p>
		</div>
	</div>
</template>
