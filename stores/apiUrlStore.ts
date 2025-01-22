import { defineStore } from 'pinia';

interface ApiUrlState {
  apiUrl: string
  appName: string
}

export const useApiUrlStore = defineStore('apiUrl', {
  state: () => ({
    apiUrl: '', // Estado inicial de la URL de la API
    appName: '', // estado inicial del nombre de la aplicacion
  }),
  actions: {
    // Acción para actualizar la URL de la API
    setApiUrl(newUrl: string) {
      this.apiUrl = newUrl;
    },
    // Accion para actualizar el nombre de la aplicacion
    setAppName(newAppName: string) {
      this.appName = newAppName
    }
  },
  persist: true, // Habilita la persistencia
});