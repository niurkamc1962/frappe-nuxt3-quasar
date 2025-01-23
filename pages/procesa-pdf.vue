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
          @rejected="onRejected"
          :label-color="labelColor"
          :class="{
            'text-white bg-gray-800 border-gray-600':
              $colorMode.value === 'dark',
            'text-gray-800 bg-white border-gray-300':
              $colorMode.value === 'light',
          }"
          class="mb-4"
          @added="handleFileUpload"
        >
          <template v-slot:prepend>
            <q-icon name="attach_file" />
          </template>
        </q-uploader>
      </div>

      <q-table
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
      </q-table>

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
              :src="selectedFile.ruta_archivo"
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
import { useApiUrlStore } from "~/stores/apiUrlStore";

// Usar el store de la URL de la API
const apiUrlStore = useApiUrlStore();

// URL dinámica para la subida de archivos
const uploadUrl = computed(() => {
  return `${apiUrlStore.apiUrl}/api/method/${apiUrlStore.appName}.api.pdf.upload_pdf`;
});

const $q = useQuasar();
const colorMode = useColorMode();
const authStore = useAuthStore();

// Computada para el color de la label en q-file
const labelColor = computed(() => {
  return colorMode.value === "dark" ? "white" : "gray-9";
});

// obteniendo los datos del usuario autenticado
// const authString = localStorage.getItem("auth");

// if (authString) {
//   const authObject = JSON.parse(authString);
//   const username = authObject.loginError.username;
//   const apiKey = authObject.loginError.api_key;
//   const apiSecret = authObject.loginError.api_secret;
//   // preparando el token para la autenticacion para que frappe no rechaze la peticion
//   // al subir el archivo pdf
//   const token = `${apiKey}:${apiSecret}`;

//   // console.log("TOKEN: ", token);

//   // console.log("Username:", username);
//   // console.log("apiKey:", apiKey);
//   // console.log("apiSecret:", apiSecret);
// } else {
//   console.log("No se encontró el valor de auth en localStorage.");
// }

// Headers para la autenticación (si es necesaria)
// const headers = [
//   {
//     name: "Authorization",
//     value: `token ${apiKey}`, // Ejemplo de token de autenticación
//   },
// ];

interface PdfFile {
  name: string;
  size: number;
  archivo_pdf: string;
  ruta_archivo: string;
  estado_archivo: string;
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

// Columnas de la tabla
const columns: TableColumn[] = [
  {
    name: "name",
    required: true,
    label: "Nombre del registro",
    align: "left",
    field: (row: PdfFile) => row.name,
    sortable: true,
  },
  {
    name: "archivo_pdf",
    label: "Nombre del archivo",
    align: "left",
    field: (row: PdfFile) => row.archivo_pdf,
    sortable: true,
  },
  {
    name: "ruta_archivo",
    label: "Ruta del archivo",
    align: "left",
    field: (row: PdfFile) => row.ruta_archivo,
    sortable: true,
  },
  {
    name: "estado_archivo",
    label: "Estado del archivo",
    align: "left",
    field: (row: PdfFile) => row.estado_archivo,
    sortable: true,
  },
  {
    name: "actions",
    label: "Acciones",
    align: "center",
    field: "actions",
  },
];

// Función para obtener el token de autenticación
function getAuthToken() {
  const authString = localStorage.getItem("auth");
  if (!authString)
    throw new Error("No se encontró el valor de auth en localStorage.");

  const authObject = JSON.parse(authString);
  const apiKey = authObject.loginError.api_key;
  const apiSecret = authObject.loginError.api_secret;
  return `${apiKey}:${apiSecret}`;
}

// Función para manejar archivos rechazados
function onRejected(rejectedEntries: any[]) {
  rejectedEntries.forEach((entry) => {
    // console.log("Archivo rechazado: ", entry.file.name);
    // console.log("Motivo Rechazo: ", entry.failedPropValidation);
    // console.log("Size KB: ", (entry.file.size / 1024).toFixed(2));

    if (entry.failedPropValidation === "max-file-size") {
      $q.notify({
        type: "negative",
        message: `El archivo "${entry.file.name}" excede el tamaño máximo permitido de 5 MB.`,
      });
    }
  });
}

// Función para manejar la subida exitosa
async function handleFileUpload(files: File[]) {
  const file = files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    // const authString = localStorage.getItem("auth");
    // if (!authString)
    //   throw new Error("No se encontró el valor de auth en localStorage.");

    // const authObject = JSON.parse(authString);
    // const apiKey = authObject.loginError.api_key;
    // const apiSecret = authObject.loginError.api_secret;
    // const token = `${apiKey}:${apiSecret}`;

    const token = getAuthToken();

    const response = await fetch(
      `${apiUrlStore.apiUrl}/api/method/upload_file`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error al subir el archivo");
    }

    const result = await response.json();
    console.log("Respuesta del servidor: ", result);

    $q.notify({
      type: "positive",
      message: "Archivo subido correctamente",
    });

    // Aquí puedes llamar a tu método personalizado para registrar el archivo en el doctype "Archivos PDF"
    const uploadResponse = await fetch(
      `${apiUrlStore.apiUrl}/api/method/${apiUrlStore.appName}.api.pdf.upload_pdf`,
      {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file: result.message.file_url,
          file_name: file.name,
          is_private: 0,
        }),
      }
    );

    if (!uploadResponse.ok) {
      throw new Error("Error al registrar el archivo en el doctype");
    }

    const uploadResult = await uploadResponse.json();
    console.log("Archivo registrado en el doctype: ", uploadResult);

    // Actualizar la lista de archivos PDF
    await fetchPdfFiles();
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error, no se pudo subir el archivo",
    });
    console.error("Error al subir el archivo pdf:", error);
  }
}

// Funcion para obtener los archivos del doctype
async function fetchPdfFiles() {
  try {
    const token = getAuthToken();

    // Llamar al método de Frappe para obtener los archivos PDF
    const response = await fetch(
      `${apiUrlStore.apiUrl}/api/method/${apiUrlStore.appName}.api.pdf.get_pdf_files`,
      {
        method: "GET",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log("Error al obtener los archivos del doctype");
      throw new Error("Error al obtener los archivos PDF");
    }

    const result = await response.json();
    pdfFiles.value = result.message; // Asignar los archivos a la lista
  } catch (error) {
    $q.notify({
      type: "negative",
      message: "Error al obtener los archivos PDF",
    });
    console.error("Error al obtener los archivos PDF:", error);
  }
}

// Llamar a la función al cargar el componente
onMounted(() => {
  fetchPdfFiles();
});
</script>
