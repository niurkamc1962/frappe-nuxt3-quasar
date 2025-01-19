<template>
  <div>
    <div class="flex items-center justify-center h-screen">
      <div class="w-full h-fu;; bg-gray-300 p-4">
        Modulo donde se podra importar datos, procesar archivos pdf, y otras
        utilidades
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({ middleware: "auth" });
</script>

<style scoped>
html {
  background-color: white;
  color: black;
  transition: background-color 0.3s, color 0.3s;
}

html.dark {
  background-color: #1a1a1a;
  color: white;
}
</style>
