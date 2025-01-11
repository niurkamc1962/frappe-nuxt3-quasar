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
      const response = await fetch('http://utilities.local:8000/api/method/utilities_app.api.login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usr: username, pwd: password }),
        });

      const data = await response.json();

      console.log("response del login", data);

      if (data.success_key === 1) {
        user.value = data.message;   // guarda los datos del usuario

        // verificando que user.value no sea null antes de acceder a sus propiedades
        if (user.value) {
          localStorage.setItem('apiKey', user.value.api_key);
          localStorage.setItem('apiSecret', user.value.api_secret)
        }
      } else {
        loginError.value = data.message
      }
    } catch (error) {
      loginError.value = 'Error en la solicitur, intente de nuevo';
      console.error("Error en la solicitud", error);
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    localStorage.removeItem('apiKey');
    localStorage.removeItem('apiSecret');
  };

  return { user, loginError, loading, login, logout }
})
