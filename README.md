# **cf-ai-rest-api: Proyecto de Aprendizaje para Principiantes**  

**Descripción:**  
cf-ai-rest-api es un proyecto web súper simple diseñado para principiantes que quieren aprender a construir una interfaz de chat con tecnologías web modernas. Este proyecto replica de forma básica la funcionalidad de chats AI como ChatGPT y Google AI Studio, permitiendo a los usuarios comunicarse con modelos de inteligencia artificial a través de una API segura almacenada en **Cloudflare Workers**.  

**Características:**  
✅ **Simplicidad** – Código corto, limpio y fácil de entender.  
✅ **Frontend ligero** – HTML, CSS y JavaScript puro, sin frameworks.  
✅ **Backend serverless** – Cloudflare Workers para manejar las solicitudes de la API de forma segura.  
✅ **Stateless** – No guarda información en bases de datos ni en el disco, asegurando privacidad y facilidad de despliegue.  
✅ **Historial en memoria** – El historial de conversación se mantiene en la sesión del navegador.  
✅ **Soporte para múltiples modelos** – Se puede configurar para usar diferentes APIs de IA.  
✅ **Responsivo** – Diseño adaptable para PC y móviles.  

**Tecnologías utilizadas:**  
- **Frontend:** HTML, CSS y JavaScript  
- **Backend:** Cloudflare Workers  
- **Seguridad:** API key protegida en el entorno de Cloudflare  

**Objetivos de aprendizaje:**  
🔹 Cómo estructurar un proyecto web simple con HTML, CSS y JS.  
🔹 Manejar peticiones HTTP a una API de IA.  
🔹 Almacenar y gestionar una API key de forma segura en Cloudflare Workers.  
🔹 Implementar historial de conversación sin base de datos.  
🔹 Adaptar el diseño para que sea responsivo en diferentes dispositivos.  

🚀 **Ideal para quienes quieren aprender a construir una aplicación funcional sin depender de bases de datos ni servidores tradicionales.**

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
```

EOF