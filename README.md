# cf-ai-rest-api

super simple web chat con ia, paracloudflare worders, con las minimas dependencias, sin build process, que lo pueda explicar en 20 min, queria algo funcional,
que este enfocado en otros aspecto mas que en la programacion, como en la plataforma donde lo vas a subir, algo de precios, etc.

my-project <--- semistandard, wrangler como dep. de desarrollo
  functions
    api
      models
        [model]
          message.js     http://127.0.0.1/api/models/*model*/message    POST    "Recive mensaje, historial, mensaje de sistema y otros parametros como el largo maximo de la respuesta. Responde con la respuesta de modelo."
          index.js       http://127.0.0.1/api/models/*model*            GET     "Responde con infomacion adicional sobre un modelo."
        index.js         http://127.0.0.1/api/models                    GET     "Responde con los modelos del archivo cf-ai-rest-api\models.js."
      [[catchall]].js    http://127.0.0.1/*any*                         ALL     "Responde con error 404 (no encontrado)."

  pages
    favicon.ico
    index.html <--- markdown-it
    main.js
    styles.css
.
.
.
-----------------------------
.
.
.
Huggingface
OpenAI
Claude
Google Gemeni API
Cloudflare Workers AI
.
.
.
y muchos otros como Stable Diffusion, ..., etc.

Muchos tienen o paquetes o rest API. Este ejemplo solo usa REST API.

https://youmightnotneedjquery.com/
https://github.com/animate-css/animate.css