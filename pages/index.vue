<script setup lang="ts">
import { useQuasar } from "quasar";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const $q = useQuasar();
const formRef: Ref<HTMLFormElement | null> = ref(null); // creando referencia para el formulario

definePageMeta({
  layout: "auth",
});

const router = useRouter();

const username = ref<string>("");
const password = ref<string>("");
const authStore = useAuthStore();

const handleLogin = async () => {
  await authStore.login(username.value, password.value);
  if (authStore.user) {
    router.push("/main");
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
              <q-input v-model="password" label="Password" />
            </div>
            <q-btn class="glossy w-full" type="submit" label="Iniciar Sesion" />
          </div>
        </q-form>
      </div>
    </div>
    <div>
      <NuxtImg src="erp.jpg" />
    </div>
  </div>
</template>
