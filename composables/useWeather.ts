import { ref } from "vue";

export const useWeather = () => {
	const weatherData = ref<any>(null);
	const errorMessage = ref<string | null>(null);

	const fetchWeather = async (latitude: number, longitude: number) => {
		try {
			const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
			const response = await fetch(
				`https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}`
			);

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Error en WeatherAPI:", errorData); // Mostrar el error exacto
				throw new Error(
					errorData.error.message || "Error desconocido en la API"
				);
			}

			const data = await response.json();
			weatherData.value = data;
			console.log("Datos del clima:", data); // Mostrar los datos del clima
		} catch (error) {
			if (error instanceof Error) {
				errorMessage.value = error.message;
			} else {
				errorMessage.value = String(error);
			}
		}
	};

	return { weatherData, errorMessage, fetchWeather };
};
