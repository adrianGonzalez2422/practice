# Roadmap: Monitor de Recursos en la Nube con Google Sheets

Este documento detalla el paso a paso organizado y las **buenas prácticas** necesarias para desarrollar el proyecto desde cero con una arquitectura limpia.

---

## Fase 1: Arquitectura y Configuración del Entorno 🏗️

Para un proyecto limpio, es fundamental separar totalmente la lógica de recolección de datos (Backend) de la visualización (Frontend).

### Estructura de Carpetas Recomendada:
```text
monitoreo-recursos/
├── backend/
│   ├── .env               # Variables secretas (NUNCA subir a GitHub)
│   ├── credentials.json   # Claves de Google API (NUNCA subir a GitHub)
│   ├── package.json       # Dependencias
│   ├── app.js             # Punto de entrada
│   └── .gitignore         # Evita subir credenciales y dependencias pesadas
└── frontend/
    ├── index.html         # Estructura de la web
    ├── style.css          # Estilos visuales
    └── script.js          # Consumo de datos y renderizado
```

### 1.1 Inicializar el Backend
1. En la carpeta `backend/` ejecuta `npm init -y`.
2. Instala dependencias: `npm install googleapis systeminformation dotenv`.
3. **Buena Práctica**: Crea el `.gitignore` inmediatamente para ignorar `node_modules/`, `.env` y `credentials.json`.

---

## Fase 2: Configuración de la "Base de Datos" (Google Sheets) 📊

### 2.1 Preparar el Documento
1. Crea un documento nuevo en Google Sheets.
2. Nombra las columnas de la primera fila: `Fecha`, `CPU (%)`, `RAM (%)`, `Temperatura (°C)`.

### 2.2 Obtener Acceso Programático y Seguro
1. Ve a [Google Cloud Console](https://console.cloud.google.com).
2. Habilita la **Google Sheets API**.
3. Crea una **Cuenta de Servicio** (Service Account). Esto te dará un archivo `.json` que descargarás.
4. Nombra ese archivo como `credentials.json` y guárdalo en tu carpeta `/backend/`.
5. Abre el `.json`, copia el `"client_email"` y ve a tu Google Sheet. Comparte la hoja con ese correo dándole el rol de **Editor**.

### 2.3 Acceso de Lectura (Para el Frontend)
1. En tu Google Sheet ve a **Compartir**.
2. Selecciona **"Cualquier usuario que tenga el vínculo puede leer"**. Esto permitirá al frontend consultar la data sin exponer tus credenciales secretas al código público del navegador.

---

## Fase 3: Construcción del Recolector (Node.js) ⚙️

### 3.1 Modularidad en el Código (`app.js`)
En lugar de tener todo mezclado, separa el archivo en tres funciones claras:
- `authGoogle()`: Solo carga `credentials.json` e inicializa el cliente.
- `getSystemMetrics()`: Solo usa `systeminformation` para medir memoria, cpu, etc.
- `sendDataToSheet(metrics)`: Solo recibe números y los envía a Google.

### 3.2 Resiliencia y Control de Errores
- Envuelve las peticiones HTTP y recolectas de datos en bloques `try/catch`. Si se cae tu internet por 2 minutos, el script mandará un error a consola pero **no se detendrá completamente**.
- Usa `setInterval` configurándolo para que los envíos ocurran con márgenes holgados (ej. cada 5 minutos - 300000ms) para no superar la cuota gratuita de la API de Google.

---

## Fase 4: Construcción del Visualizador (Frontend) 🖥️

### 4.1 Diseño Visual
- Crea una interfaz atractiva. Utiliza **Glassmorphism** (diseños translúcidos tipo cristal en fondo oscuro) y fuentes modernas.

### 4.2 Consumo de Datos Seguro
- Utiliza la API nativa de JavaScript `fetch()` para descargar tu hoja de Excel exportada directamente a CSV de esta forma:
  `https://docs.google.com/spreadsheets/d/TU_ID_AQUI/export?format=csv`
- **Por qué funciona esto:** Al compartir la hoja de Excel como pública para lectura, cualquier frontend puede consumir estos datos usando el navegador y parseándolos sin necesidad de interactuar vía contraseñas.

### 4.3 Integración de Chart.js
- Carga `chart.js` mediante la CDN en tu archivo `.html`.
- Usa los datos extraídos para alimentar dos tarjetas gráficas HTML Canvas (Una comparando histórico de CPU vs. RAM y otra mostrando histórico de Temperatura).

---

## Fase 5: Despliegue y Nivel Pro 🚀

Para finalizar y hacer que el proyecto destaque verdaderamente:

1. **Mantener el backend vivo siempre:**
   En vez de lanzar el recolector con `node app.js`, instala [PM2](https://pm2.keymetrics.io/) con `npm i -g pm2`. Ejecuta tu proyecto con `pm2 start app.js --name "recolector"`. PM2 hace que el proceso corra en segundo plano permanentemente y, si se cruza un error inesperado y "crushea", PM2 lo reiniciará automáticamente al instante.

2. **Subir el Frontend a la nube:**
   ¡Sube tu carpeta `frontend/` a plataformas gratuitas como [Vercel](https://vercel.com), [Netlify](https://www.netlify.com/) o **GitHub Pages**! Como se comunica directo por la URL pública a Google Sheets, tendrás un panel de métricas en internet vivo las 24 hrs donde vigilar tu servidor directamente desde tu teléfono móvil.

3. **Curador de Datos (Mantenimiento):**
   Tarde o temprano, la hoja tendrá diez mil filas. Programa (ya sea un cron de Node o Google Apps Script) que si la hoja llega a más de X mediciones, borre las mediciones muy viejas o las divida en hojas mensuales.