// composables/useGeolocation.ts
import { ref } from "vue";

export const useGeoLocation = () => {
	const geolocationData = ref<any>(null);
	const errorMessage = ref<string | null>(null);

	const fetchGeolocation = async () => {
		try {
			const response = await fetch("https://ipapi.co/json/");
			if (!response.ok) {
				throw new Error("No se pudieron obtener los datos de geolocalización");
			}

			const data = await response.json();
			geolocationData.value = data;
		} catch (error) {
			if (error instanceof Error) {
				errorMessage.value = error.message;
			} else {
				errorMessage.value = String(error);
			}
		}
	};

	return { geolocationData, errorMessage, fetchGeolocation };
};
