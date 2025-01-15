<template>
  <div class="min-h-screen">
    <!-- Top Navigation Bar -->
    <header class="bg-gray-500 shadow">
      <div class="mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex h-16 items-center justify-between">
          <div class="text-2xl font-semibold">ERP-NUXT-Utilities</div>
        </div>
      </div>
    </header>

    <div class="flex h-[calc(100vh-64px)]">
      <!-- Sidebar -->
      <aside class="w-64 border-r bg-gray-200 dark:bg-gray-800">
        <nav class="flex flex-col h-full">
          <div class="px-4 grow">
            <div class="grid gap-2 mt-4">
              <NuxtLink
                :href="item.path"
                v-for="(item, index) in navigationLinks"
                :key="index"
                :class="[
                  'flex items-center gap-2 px-2 py-1 transition rounded cursor-pointer link',
                  { 'link-active': isActive(item.path) },
                ]"
              >
                <Icon
                  v-if="item.icon"
                  :name="item.icon"
                  size="20"
                  :class="{
                    'text-gray-800 dark:text-yellow-200': !isActive(item.path),
                    'text-yellow-200': isActive(item.path),
                  }"
                />
                <span
                  :class="{
                    'text-gray-800 dark:text-yellow-200': !isActive(item.path),
                    'text-yellow-200': isActive(item.path),
                  }"
                >
                  {{ item.title }}
                </span>
              </NuxtLink>
            </div>
          </div>
          <div class="p-4 border-r">
            <button @click="changeColor">
              {{ $colorMode.value === "dark" ? "☀️" : "🌙" }} Modo
            </button>
          </div>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-6 overflow-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute();

const colorMode = useColorMode();
const changeColor = () => {
  if (colorMode.value === "light") {
    colorMode.preference = "dark";
  } else if (colorMode.value === "dark") {
    colorMode.preference = "light"; // Cambia esto si decides agregar un modo sepia
  } else {
    colorMode.preference = "light";
  }
};

const isActive = (path: string) => {
  return route.path === path;
};

// Define interfaces de navegacion en la barra lateral
interface NavigationLink {
  title: string;
  icon: string;
  path: string;
}

interface UserMenuItem {
  title: string;
  icon: string;
  path: string;
}

const navigationLinks: NavigationLink[] = [
  {
    title: "Sql Server - Maria DB",
    icon: "i-heroicons-arrow-up-tray",
    path: "/siscont-erp",
  },
  {
    title: "Gestion archivos PDF",
    icon: "i-heroicons-document",
    path: "/procesa-pdf",
  },
  {
    title: "Clientes-Proveedores PDF",
    icon: "i-heroicons-envelope",
    path: "/adjunto-pdf",
  },
];

const userMenuItems: UserMenuItem[][] = [
  [
    {
      title: "Administración",
      icon: "i-heroicons-cog-8-tooth",
      path: "/admin",
    },
    {
      title: "Perfil",
      icon: "i-heroicons-user",
      path: "/perfil",
    },
  ],
  [
    {
      title: "Cerrar Sesión",
      icon: "i-heroicons-arrow-left-on-rectangle",
      path: "/",
    },
  ],
];

// Aplanar el arreglo de userMenuItems
const flatUserMenuItems = userMenuItems.flat();

// Función para navegar a la ruta correspondiente
const goTo = (path: string) => {
  // Aquí puedes usar router.push o cualquier método de navegación que estés usando
  console.log(`Navegando a: ${path}`);
  // Ejemplo: router.push(path);
};
</script>

<style>
html {
  background-color: white;
  color: black;
  transition: background-color 0.3s, color 0.3s;
}

html.dark {
  background-color: #1a1a1a;
  color: white;
}

.color-mode-container {
  padding: 1rem;
  text-align: center;
}

button {
  padding: 0.5rem 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  background: none;
  border: 1px solid currentColor;
  border-radius: 0.5rem;
  margin-right: 1rem;
}

h1 {
  text-align: center;
  margin-top: 2rem;
}
</style>
