import { ref } from "vue";

interface NewsArticle {
	title: string;
	description: string;
	url: string;
	urlToImage: string; // Imagen relacionada con la noticia
	publishedAt: string;
}

interface FetchNewsResponse {
	status: string;
	totalResults: number;
	articles: NewsArticle[];
}

const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = "https://newsapi.org/v2/everything";

export default function useNewsApi() {
	const news = ref<NewsArticle[]>([]);
	const loading = ref(false);
	const error = ref<string | null>(null);

	const fetchCinemaNews = async (language: string): Promise<NewsArticle[]> => {
		loading.value = true;
		error.value = null;

		try {
			const params = new URLSearchParams({
				q: "cinema OR movies OR actors OR actresses OR theater",
				apiKey: API_KEY,
				language,
				sortBy: "relevance",
				pageSize: "10",
			});

			const response = await fetch(`${BASE_URL}?${params}`);
			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const data: FetchNewsResponse = await response.json();
			news.value = data.articles;

			return data.articles;
		} catch (err: any) {
			error.value = err.message || "Error desconocido";
			console.error("Error al buscar noticias:", err);
			news.value = [];
			return [];
		} finally {
			loading.value = false;
		}
	};

	return { news, loading, error, fetchCinemaNews };
}
