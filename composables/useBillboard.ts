import { ref } from "vue";
import axios from "axios";

// MovieGlu API key
const apikey = import.meta.env.VITE_MOVIEGLU_API_KEY;
if (!apikey) {
	throw new Error("API key not found");
}

const apiBaseUrl = "https://api-gate2.movieglu.com";

export const useBillboard = () => {
	const movies = ref([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const getMoviesInTheatersByCityAndTitle = async (
		city: string,
		title: string
	) => {
		movies.value = [];
		loading.value = true;
		error.value = null;

		try {
			const response = await axios.get(`${apiBaseUrl}/filmShowTimes/`, {
				headers: {
					"x-api-key": apikey,
					client: "your_client_name",
					territory: "ES",
					"api-version": "v200",
				},
				params: {
					n: 5,
					date: new Date().toISOString().split("T")[0],
					location: city,
					title, // Filtra por título
				},
			});

			if (response.data.status.state === "OK" && response.data.cinemas) {
				movies.value = response.data.cinemas;
			} else {
				error.value = "No movies found for the given city and title.";
			}
		} catch (err: any) {
			error.value = err.message || "Unknown error";
		} finally {
			loading.value = false;
		}
	};

	return { movies, loading, error, getMoviesInTheatersByCityAndTitle };
};
