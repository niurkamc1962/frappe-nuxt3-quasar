<template>
  <div :class="{ 'dark-mode': $colorMode.value === 'dark' }">
    <h1>Procesar Archivos PDF</h1>
    <div class="p-4">
      <div class="mb-6">
        <q-uploader
          style="max-width: 300px"
          v-model="pdfFile"
          label="Archivo PDF (max. size 5MB)"
          accept=".pdf"
          filled
          max-file-size="40000000"
          url="http://frappe-nuxt.local:8000/api/method/frappe_nuxt_app.api.pdf.upload_pdf"
          :headers="headers"
          @uploaded="onUploaded"
          @failed="onFailed"
          @rejected="onRejected"
          :label-color="labelColor"
          :class="{
            'text-white bg-gray-800 border-gray-600':
              $colorMode.value === 'dark',
            'text-gray-800 bg-white border-gray-300':
              $colorMode.value === 'light',
          }"
          class="mb-4"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-uploader>
      </div>

      <!-- <q-table
        :rows="pdfFiles"
        :columns="columns"
        row-key="name"
        selection="single"
        v-model:selected="selected"
        :class="{
          'bg-gray-800 text-white': $colorMode.value === 'dark',
          'bg-white': $colorMode.value === 'light',
        }"
        class="rounded-lg shadow-lg"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              @click="previewPdf(props.row)"
            >
              <q-tooltip>Ver PDF</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              @click="deletePdf(props.row)"
            >
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table> -->

      <q-dialog v-model="previewDialog" full-width>
        <q-card>
          <q-card-section class="items-center row q-pb-none">
            <div class="text-h6">{{ selectedFile?.name }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section>
            <iframe
              v-if="selectedFile"
              :src="selectedFile.url"
              width="100%"
              height="600"
              frameborder="0"
            ></iframe>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useQuasar } from "quasar";
import { useColorMode } from "#imports";
import { useAuthStore } from "~/stores/authStore";

const $q = useQuasar();
const colorMode = useColorMode();
const authStore = useAuthStore();

// Obteniendo el apiKey del store
const apiKey = authStore.user?.api_key;

// Computada para el color de la label en q-file
const labelColor = computed(() => {
  return colorMode.value === "dark" ? "white" : "gray-9";
});

// Headers para la autenticación (si es necesaria)
const headers = [
  {
    name: "Authorization",
    value: `token ${apiKey}`, // Ejemplo de token de autenticación
  },
];

interface PdfFile {
  name: string;
  size: number;
  uploadDate: string;
  url: string;
}

interface TableColumn {
  name: string;
  required?: boolean;
  label: string;
  align?: string;
  field: ((row: PdfFile) => string) | string;
  sortable?: boolean;
  format?: (val: number) => string;
}

const pdfFile = ref<File | null>(null);
const pdfFiles = ref<PdfFile[]>([]);
const selected = ref<PdfFile[]>([]);
const previewDialog = ref<boolean>(false);
const selectedFile = ref<PdfFile | null>(null);

const columns: TableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Nombre del archivo",
    align: "left",
    field: (row: PdfFile) => row.name,
    sortable: true,
  },
  {
    name: "size",
    label: "Tamaño",
    field: "size",
    sortable: true,
    format: (val: number) => formatFileSize(val),
  },
  {
    name: "uploadDate",
    label: "Fecha de subida",
    field: "uploadDate",
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    field: "actions",
  },
];

// Función para manejar archivos rechazados
function onRejected(rejectedEntries: any[]) {
  rejectedEntries.forEach((entry) => {
    console.log("Archivo rechazado: ", entry.file.name);
    console.log("Motivo Rechazo: ", entry.failedPropValidation);
    console.log("Size KB: ", (entry.file.size / 1024).toFixed(2));

    if (entry.failedPropValidation === "max-file-size") {
      $q.notify({
        type: "negative",
        message: `El archivo "${entry.file.name}" excede el tamaño máximo permitido de 5 MB.`,
      });
    }
  });
}

// Función para manejar la subida exitosa
function onUploaded(info: { files: File[]; xhr: XMLHttpRequest }) {
  const response = JSON.parse(info.xhr.response);
  if (response.message) {
    $q.notify({
      type: "positive",
      message: response.message,
    });

    // Agregar el archivo subido a la lista
    const newFile: PdfFile = {
      name: info.files[0].name,
      size: info.files[0].size,
      uploadDate: new Date().toLocaleDateString(),
      url: URL.createObjectURL(info.files[0]),
    };
    pdfFiles.value.push(newFile);
  }
}

// Función para manejar errores de subida
function onFailed(info: { files: File[]; xhr: XMLHttpRequest }) {
  $q.notify({
    type: "negative",
    message: "Error al subir el archivo",
  });
  console.error("Error en la subida:", info.xhr.response);
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function handleFileUpload(file: File | null): Promise<void> {
  if (!file) return;

  // Creando un objeto FormData para enviar el archivo
  const formData = new FormData();
  formData.append("file", file); // file es el nombre del campo que se espera en el backend

  try {
    // enviar el archivo pdf a la api de Frappe
    const response = await fetch(
      "http://frappe-nuxt.local:8000/api/method/frappe_nuxt_app.api.upload_pdf",
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error al subir el archivo");
    }

    const newFile: PdfFile = {
      name: file.name,
      size: file.size,
      uploadDate: new Date().toLocaleDateString(),
      url: URL.createObjectURL(file),
    };

    pdfFiles.value.push(newFile);
    pdfFile.value = null;

    // Mostrar notificacion
    $q.notify({
      type: "positive",
      message: "Archivo subido correctamente",
    });
    console.log("Respuesta del servidor: ", response.data);
  } catch (error) {
    // Notificacion de error
    $q.notify({
      type: "negative",
      message: "Error, no se pudo subir el archivo",
    });
    console.error("Error al subir el archivo pdf:", error);
  }
}

function previewPdf(file: PdfFile): void {
  selectedFile.value = file;
  previewDialog.value = true;
}

function deletePdf(file: PdfFile): void {
  const index = pdfFiles.value.indexOf(file);
  if (index > -1) {
    pdfFiles.value.splice(index, 1);
  }
}
</script>
