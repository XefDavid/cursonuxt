<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted, reactive } from "vue";

const router = useRouter();

const user = reactive<{
	name: string | null;
	email: string | null;
	id: string | null; //sabemos que laid es un number pero lo estamos tratando como string, porque solo se maneja desde la base de datos.
}>({
	name: null,
	email: null,
	id: null,
});

onMounted(async () => {
	if (typeof window !== "undefined") {
		const token = localStorage.getItem("auth_token");
		console.log("Your token is =>", token);

		if (!token) {
			console.log("no token, go to login...");
			router.push("/");
			return;
		}

		try {
			const response = await fetch("/api/user", {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});

			console.log("Respuesta recibida:", response);

			if (!response.ok) {
				console.error(
					"Error al obtener los datos del usuario:",
					response.statusText
				);
				router.push("/");
				return;
			}

			const userData = await response.json();

			if (userData && userData.body) {
				console.log("Estructura de los datos:", userData.body);

				user.name = userData.body.name;
				user.email = userData.body.email;
				user.id = userData.body.id;

				console.log("Datos del usuario asignados:", user);
			} else {
				console.error(
					"La respuesta no contiene los datos del usuario esperados"
				);
			}
		} catch (error) {
			console.error("Error al conectar con el backend:", error);
			router.push("/");
		}
	}
});
</script>

<template>
	<div
		class="flex justify-start items-center p-7 opacity-90 text-blue-900 font-mono"
	>
		<div class="bg-blue-200 p-8 w-[30%] h-[650px] rounded-xl font-bold text-lg">
			<h1 v-if="user.name">¡Welcome back {{ user.name }}!</h1>
			<p v-else>Cargando datos del usuario...</p>
		</div>
	</div>
</template>
