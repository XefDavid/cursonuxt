// composables/useMovieGlu.ts
import { ref } from "vue";
import axios from "axios";

export default function useMovieGlu() {
	const movies = ref([]);
	const error = ref(null);

	// Credenciales proporcionadas
	const clientId = "MOVI_243";
	const apiKey = "lyE9M0tbZ032agfqn1WYo3XusiN4qY015H2Y2kf5";
	const territory = "ES";
	const apiVersion = "v201";
	const geolocation = "52.47;-1.93"; // Puedes actualizarlo dinámicamente si tienes acceso a la ubicación

	const fetchMovies = async () => {
		try {
			const response = await axios.get(
				"https://api-gate2.movieglu.com/filmsNowShowing/?n=20",
				{
					headers: {
						client: clientId,
						"x-api-key": apiKey,
						authorization: "Basic TU9WSV8yNDM6b1hCVHdSd0pPd1pY", // Credenciales Base64 pre-generadas
						territory,
						"api-version": apiVersion,
						geolocation,
						"device-datetime": new Date().toISOString(), // Genera el formato ISO 8601
					},
				}
			);
			movies.value = response.data.films;
		} catch (err) {
			console.error(err);
			error.value = err.response?.data?.message || err.message;
		}
	};

	return { movies, error, fetchMovies };
}
