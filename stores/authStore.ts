import { defineStore } from 'pinia'
import { ref } from 'vue'

interface User {
  api_key: string;
  api_secret: string;
  username: string;
  email: string;
}

export const useAuthStore = defineStore('auth', () => {
  // Estado Inicial
  const user = ref<User | null>(null)
  const loginError = ref<string | null>(null)
  const loading = ref<boolean>(false)

  // accion para iniciar sesion
  const login = async (username: string, password: string) => {
    loading.value = true;
    loginError.value = null;

    try {
      const response = await fetch('http://frappe-nuxt.local:8000/api/method/frappe_nuxt_app.api.auth.login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usr: username, pwd: password }),
        });

      const data = await response.json();

      console.log("Datos OBTENIDOS del login DATA: ", data);

      // verficia el success_key para determinar si fue exitora la autenticacion
      if (data.success_key === 1) {
        user.value = data.message;   // guarda los datos del usuario
        console.log("SUCCESS_KEY 1 LOGIN: ", user.value);

        // verificando que user.value no sea null antes de acceder a sus propiedades
        if (user.value) {
          localStorage.setItem('apiKey', user.value.api_key);
          localStorage.setItem('apiSecret', user.value.api_secret)
        }
        return { success_key: 1, message: 'Autenticacion exitosa' }
      } else {
        loginError.value = data.message
        return { success_key: 0, message: loginError.value };  // retornando el error
      }
    } catch (error) {
      loginError.value = 'Error en la solicitud, intente de nuevo';
      return { success_key: 0, message: loginError.value };  // retornando el error
    } finally {
      loading.value = false;
    }
  };

  // Accion para cerrar sesion
  const logout = () => {
    user.value = null;
    localStorage.removeItem('apiKey');
    localStorage.removeItem('apiSecret');
  };

  // Accion para verificar la autenticacion con el backend
  const checkAuth = async () => {
    try {
      const response = await fetch('http://frappe-nuxt.local:8000/api/method/frappe.auth.get_logged_user', {
        method: 'GET',
        headers: {
          Authorization: `token ${user.value?.api_secret}`,
        },
      });

      const data = await response.json();

      console.log('Datos del CHECKAUTH: ', data);

      if (data.message && data.message !== "Guest") {
        // verificando si coincide el usuario autenticado en el frontend con el backend
        const storedUsername = localStorage.getItem('username');
        if (data.message.username === storedUsername) {

          return true;  // Usuario autenticado en el backend
        }
      } else {
        logout(); // Cierra sesion si el backend no esta autenticado
      }
    } catch (error) {
      logout(); // cierra sesion si hay error 
      return false;
    }
  }

  return { user, loginError, loading, login, logout, checkAuth }
})
