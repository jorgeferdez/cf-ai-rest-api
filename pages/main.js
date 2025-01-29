let systemMessage = '';
let messages = [];
let controller = new AbortController();

document.addEventListener('DOMContentLoaded', async function (event) {
  // Cargar modelos desde el backend (functions/api/models/index.js)
  // y agregarlos al select
  const response = await fetch('/api/models');
  const data = await response.json();
  const select = document.querySelector('.models');
  for (const e of data) {
    const option = document.createElement('option');
    option.value = e.model;
    option.textContent = e.model;
    select.insertAdjacentElement('beforeend', option);
  }
  // Limpiar todos los controles del form cuando el modelo seleccionado cambie
  document.querySelector('.models').addEventListener('change', function (event) {
    document.querySelector('.chat-form').reset();
  });
  // Agregar eventos al form
  document.querySelector('.chat-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const selectedModel = document.querySelector('.models').value;
    const message = document.querySelector('.message');
    const content = message.value;
    // if (!content) { message.focus(); return; }

    // Cambiar el estado del boton a ocupado
    updateRunButtonState(true);
    try {
      // Realizar la solicitud al backend para procesar el mensaje
      const response = await fetch('api/models/' + encodeURIComponent(selectedModel) + '/message', {
        body: JSON.stringify({ systemMessage, messages, content }),
        method: 'POST',
        signal: controller.signal
      });
      // Si la respuesta no es exitosa, restablecer el estado y abortar la solicitud
      if (response.status !== 200) { updateRunButtonState(false); controller = new AbortController(); return; }

      // Parsear la respuesta JSON y añadir los mensajes al historial
      const json = await response.json();
      messages.push({ role: 'user', content });
      messages.push({ role: 'assistant', content: (json.candidates ? json.candidates[0].content.parts[0].text : json.response) });

      // Convertir el contenido a formato Markdown y agregarlo al historial de mensajes
      const parser = window.markdownit();
      document.querySelector('.messages').insertAdjacentHTML('beforeend', '🗣️' + parser.render(content) + '<hr />✨' +
        parser.render(json.candidates ? json.candidates[0].content.parts[0].text : json.response) + '<hr />');

      // Restablecer el estado del botón y limpiar el campo de mensaje
      updateRunButtonState(false);
      message.value = '';
      message.focus();
    } catch (error) {
      console.log(error);
      controller = new AbortController();
      updateRunButtonState(false);
    }
  });
  // Evento que se ejecuta cuando se reinicia el formulario de chat
  document.querySelector('.chat-form').addEventListener('reset', async function (event) {
    event.preventDefault();

    // Abortamos la solicitud en curso
    controller.abort();
    controller = new AbortController();

    // restablecemos las variables
    systemMessage = '';
    messages = [];
    document.querySelector('.messages').innerHTML = '';
    document.querySelector('.message').value = '';
  });
});

// Función para actualizar el estado del botón de envío
function updateRunButtonState (isbusy) {
  const button = document.querySelector('.chat-form [type="submit"]');
  if (isbusy) {
    button.textContent = '';
    button.setAttribute('aria-busy', 'true');
  } else {
    button.textContent = 'Run';
    button.setAttribute('aria-busy', 'false');
  }
}
