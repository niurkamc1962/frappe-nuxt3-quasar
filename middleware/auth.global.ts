import { navigateTo } from "#app";
import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();

    console.log("MIddleware ejecutandose");


    // lista de rutas que no necesitan autenticacion
    const publicRoutes = ['/', '/listClientes']  // ajustar segun sea necesario

    // si la ruta esta en la lista de publicRoutes no hacer nada
    if (publicRoutes.includes(to.path)) {
        console.log("NO se requiere autenticacion por se publica la ruta");

        return;  // no hacer nada si ya esta en la pagina de autenticarse
    }

    // Verifica si esta autenticado el usuario en el frontend
    console.log('PReguntando por authStore: ', authStore)
    if (!authStore.user) {
        console.log("No autenticado en el frontend, redirigiendo a /");
        return navigateTo('/')
    }

    // verifica si esta autenticado en el backend
    const isAuthenticated = await authStore.checkAuth()

    if (!isAuthenticated) {
        console.log("No autenticado en el backend despues de authStore.checkAuth, redirige a /");
        return navigateTo('/')
    }

    console.log("Usuario autenticado, continuando ....");



})