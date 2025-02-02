# cf-ai-rest-api

### Estructura de carpetas y archivos

```
│   .example.vars    // Ejemplo de archivo de API keys. Renómbralo a dev.vars y agrega las API keys reales. dev.vars está en .gitignore, así que no se subirá a GitHub.
│   .gitignore    // Lista de archivos y carpetas que no se subirán a GitHub.
│   LICENSE    // Licencia del proyecto.
│   models.js    // Archivo con la configuración de los modelos utilizados por el backend.
│   package-lock.json    // Archivo que registra las versiones exactas de las dependencias instaladas. Es recomendable subirlo a GitHub para asegurar consistencia.
│   package.json    // Archivo de configuración de Node.js, contiene las dependencias y scripts del proyecto.
│   README.md    // Documentación del proyecto.
│   wrangler.toml    // Archivo de configuración de Cloudflare Pages.
│
├───functions    // backend
│   └───api
│       │   [[catchall]].js    // [ALL] Responde con error 404 para cualquier rutas no definidas. Por ej.: api/perros/gatos/etc.
│       │
│       └───models
│           │   index.js    // [GET] api/model — Devuelve la lista de modelos definidos en models.js.
│           │
│           └───[model]
│                   index.js    // [GET] api/models/:modelo — Devuelve información sobre un modelo específico. Por ahora, tiene funcionalidad limitada.
│                   message.js    // [POST] api/models/:modelo/message — Procesa un mensaje junto con el historial de la conversación para genera una respuesta.
│
└───pages    // frontend
        favicon.ico
        index.html
        main.js
        styles.css