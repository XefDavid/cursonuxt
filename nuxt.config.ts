// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	devtools: { enabled: true },
	css: ["~/assets/css/main.css"],

	postcss: {
		plugins: {
			tailwindcss: {},
			autoprefixer: {},
		},
	},
	runtimeConfig: {
		public: {
			omdbApiKey: process.env.OMDB_API_KEY, // Carga la variable desde el archivo .env
		},
	},
	compatibilityDate: "2024-12-20",
});
