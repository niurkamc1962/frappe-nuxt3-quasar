<template>
  <div class="min-h-screen">
    <!-- Top Navigation Bar -->
    <header class="items-center justify-between p-4 bg-gray-500 flext">
      <span class="text-xl font-semibold">ERP-NUXT-Utilities</span>
      <div>
        <DropdownMenu :items="userMenuItems">
          <Button color="gray" variant="ghost">
            <Avatar size="sm" src="" :alt="'User avatar'" />
            <span>Mi Cuenta</span>
            <Icon name="i-heroicons-chevron-down" />
          </Button>
        </DropdownMenu>
      </div>
    </header>

    <div class="flex h-[calc(100vh-64px)]">
      <!-- Sidebar -->
      <aside class="w-64 border-r bg-gray-50">
        <nav class="flex flex-col h-full">
          <div class="px-4 grow">
            <div class="grid gap-2">
              <NuxtLink
                :href="item.path"
                v-for="(item, index) in navigationLinks"
                :key="index"
                class="flex items-center gap-2 px-2 py-1 transition rounded cursor-pointer hover:bg-neutral-100"
              >
                <Icon v-if="item.icon" :name="item.icon" size="20" />
                <span>
                  {{ item.title }}
                </span>
              </NuxtLink>
            </div>
          </div>
          <div class="p-4 border-t">
            <NuxtLink @click.prevent="openModal">
              <Button variant="link">
                <i-heroicons-cog-6-tooth />Configuración
              </Button>
            </NuxtLink>

            <Dialog
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
import type { NavigationMenuSub } from "radix-vue";
import { DropdownMenu } from "radix-vue/namespaced";

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
    title: "Importar Datos SQL",
    icon: "i-heroicons-arrow-up-tray",
    path: "/importar",
  },
  {
    title: "Gestion archivos PDF",
    icon: "i-heroicons-document",
    path: "/pdf",
  },
  {
    title: "Enviar Correos",
    icon: "i-heroicons-envelope",
    path: "/correos",
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
</script>
