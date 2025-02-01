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
    // Abortar la solicitud
    controller.abort();
    controller = new AbortController();

    // Restabler las variables
    systemMessage = '';
    messages = [];
    document.querySelector('.messages').innerHTML = '';

    // Restablecer el estado del botón y limpiar el campo de mensaje
    updateSubmitButtonState(false);
  });

  // Funcion para actualizar el estado del boton "submit"
  const updateSubmitButtonState = (busy) => {
    const button = document.querySelector('[type="submit"]');
    button.textContent = busy ? 'Enviando...' : 'Enviar';
    // button.setAttribute('aria-busy', busy);
  };

  // Agregar eventos al form
  // Evento submit
  document.querySelector('.prompt-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const selectedModel = document.querySelector('.models').value;
    const message = document.querySelector('.message');
    const userContent = message.value;

    // Cambiar el estado del boton a ocupado
    updateSubmitButtonState(true);
    try {
      // Realizar la solicitud al backend para procesar el mensaje
      const response = await fetch('api/models/' + encodeURIComponent(selectedModel) + '/message', {
        body: JSON.stringify({ systemMessage, messages, content: userContent }),
        method: 'POST',
        signal: controller.signal
      });

      // Si la respuesta no es exitosa, restablecer el estado y abortar la solicitud
      if (response.status !== 200) {
        updateSubmitButtonState(false);
        controller = new AbortController();
        return;
      }

      // Parsear la respuesta JSON y añadir los mensajes al historial
      const json = await response.json();
      messages.push({ role: 'user', content: userContent });
      const getAssistantContent = () => {
        if (selectedModel.startsWith('cloudflare')) {
          return json.response;
        }
        if (selectedModel.startsWith('google')) {
          return json.candidates[0].content.parts[0].text;
        }
      };
      const assistantContent = getAssistantContent();
      console.log(assistantContent);
      messages.push({ role: 'assistant', content: assistantContent });

      // Convertir el contenido a formato Markdown y agregarlo al historial de mensajes
      const parser = window.markdownit();
      let hr = '';
      if (document.querySelector('.messages').innerHTML !== '') {
        hr = '<hr />';
      }
      document.querySelector('.messages').insertAdjacentHTML('beforeend', hr + '🗣️' + '<div class="user-message">' + parser.render(userContent) + '</div>' +
        '<hr />✨<div class="assistant-message">' + parser.render(assistantContent) + '</div>');

      // Restablecer el estado del boton y limpiar el campo de mensaje
      updateSubmitButtonState(false);
      message.value = '';
      message.focus();
    } catch (error) {
      console.log(error);
      controller = new AbortController();
      updateSubmitButtonState(false);
    }
  });

  // Evento reset
  document.querySelector('.prompt-form').addEventListener('reset', async function (event) {
    event.preventDefault();

    // Abortar la solicitud
    controller.abort();
    controller = new AbortController();

    // Restablecer las variables
    systemMessage = '';
    messages = [];
    document.querySelector('.messages').innerHTML = '';
    document.querySelector('.message').value = '';
    updateSubmitButtonState(false);
  });
});
