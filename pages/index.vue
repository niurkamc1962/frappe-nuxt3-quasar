<script setup lang="ts">
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const $q = useQuasar();
// const formRef: Ref<HTMLFormElement | null> = ref(null); // creando referencia para el formulario

definePageMeta({
  layout: "auth",
});

const router = useRouter();

const username = ref<string>("");
const password = ref<string>("");
const authStore = useAuthStore();

const errorMessage = ref<string | null>(null);

const handleLogin = async () => {
  // llamar metodo del authStore y esperar respuesta
  const response = await authStore.login(username.value, password.value);

  // console.log("Response: ", response.message.success_key);
  // verificando si hay error de autenticacion
  if (response.message.success_key == 1) {
    // redirigir a la pagina principal
    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Usuario autenticado satisfactoriamente",
    });
    router.push("/main").catch((err) => {
      console.error("error al redirigir", err);
    });
  } else {
    // mostrando aviso de error con Quasar
    $q.notify({
      color: "red-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Error en la autenticacion",
    });
  }
};
</script>

<template>
  <div class="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
    <div class="flex items-center justify-center py-12">
      <div class="mx-auto grid w-[350px] gap-6">
        <div class="grid gap-2 text-center">
          <h1 class="text-2xl font-bold">Teclee las Credenciales</h1>
        </div>
        <q-form @submit.prevent="handleLogin" class="grid gap-4">
          <div class="grid gap-4">
            <div class="grid gap-2">
              <q-input v-model="username" label="E-mail" />
              <q-input v-model="password" type="password" label="Password" />
            </div>
            <!-- Mostrando mensaje de error -->
            <div v-if="errorMessage" class="text-negative">
              {{ errorMessage }}
            </div>

            <q-btn
              class="w-full glossy"
              rounded
              color="primary"
              type="submit"
              label="Iniciar Sesion"
            />
          </div>
        </q-form>
      </div>
    </div>
    <div>
      <NuxtImg src="erp.jpg" />
    </div>
  </div>
</template>
