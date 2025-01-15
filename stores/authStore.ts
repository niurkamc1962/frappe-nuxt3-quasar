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
      const response = await fetch('http://frappe-nuxt.local:8000/api/method/frappe_nuxt_app.api.login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ usr: username, pwd: password }),
        });

      const data = await response.json();

      // console.log("response del login", data);

      // verficia el success_key para determinar si fue exitora la autenticacion
      if (data.success_key === 1) {
        user.value = data.message;   // guarda los datos del usuario

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

  const logout = () => {
    user.value = null;
    localStorage.removeItem('apiKey');
    localStorage.removeItem('apiSecret');
  };

  return { user, loginError, loading, login, logout }
})
