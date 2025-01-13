export const useWatchmode = () => {
	const apiKey = useRuntimeConfig().public.watchmodeApiKey;

	// Buscar el title_id de una película
	const searchMovie = async (query) => {
		try {
			const response = await $fetch(`https://api.watchmode.com/v1/search/`, {
				method: "GET",
				params: {
					apiKey,
					search_field: "name",
					search_value: query,
				},
			});
			return response.title_results || [];
		} catch (error) {
			console.error("Error searching for the movie:", error);
			return [];
		}
	};

	// Obtener proveedores de streaming por title_id
	const getProviders = async (titleId) => {
		try {
			const response = await $fetch(
				`https://api.watchmode.com/v1/title/${titleId}/sources/`,
				{
					method: "GET",
					params: {
						apiKey,
						regions: "ES", // Región España
					},
				}
			);
			console.log("Proveedores obtenidos:", response);
			return response || [];
		} catch (error) {
			console.error("Error getting providers:", error);
			return [];
		}
	};

	return {
		searchMovie,
		getProviders,
	};
};
