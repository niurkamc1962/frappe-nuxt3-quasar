import { useAuthStore } from "~/stores/authStore";

export default defineNuxtRouteMiddleware(async (to) => {
    const authStore = useAuthStore();

    // lista de rutas que no necesitan autenticacion
    const publicRoutes = ['/', '/listClientes']  // ajustar segun sea necesario

    // si la ruta esta en la lista de publicRoutes no hacer nada
    if (publicRoutes.includes(to.path)) {
        return;  // no hacer nada si ya esta en la pagina de autenticarse
    }

    console.log('localStorage: ', localStorage);

    try {
        const authString = localStorage.getItem('auth');
        if (authString) {
            const authObject = JSON.parse(authString);
            const username = authObject.loginError.username;
            const email = authObject.loginError.email;
            // console.log('Username:', username);
            // console.log('Email:', email);
            if (!username) {
                return navigateTo('/')
            } else {
                navigateTo('/main')
            }
        } else {
            console.log('No se encontró el valor de auth en localStorage.');
        }
    } catch (error) {
        console.error('Error al parsear el valor de auth:', error);
    }


})