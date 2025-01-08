export default defineNuxtRouteMiddleware((to, from) => {
	if (process.client) {
		// Verifica si el token existe
		const token = localStorage.getItem("auth_token");

		if (!token) {
			// Redirige al login si no está autenticado
			return navigateTo("/");
		}
	}
});
