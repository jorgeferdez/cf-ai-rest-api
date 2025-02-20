let systemMessage = '';
let messages = [];
let controller = new AbortController();

document.addEventListener('DOMContentLoaded', async function (event) {
  // Cargar modelos desde el backend y agregarlos al select
  const response = await fetch('/api/models'); // Si da error dejo que la excepción fluya hacia arriba
  const data = await response.json();
  const select = document.querySelector('.models');
  for (const e of data) {
    const option = document.createElement('option');
    option.value = e.model;
    option.textContent = e.model;
    select.insertAdjacentElement('beforeend', option);
  }

  // Limpiar todos los controles del formulario cuando el modelo seleccionado cambie
  document.querySelector('.models').addEventListener('change', function (event) {
    // Abortar la solicitud
    controller.abort();
    controller = new AbortController();

    // Restablecer las variables
    systemMessage = '';
    messages = [];
    document.querySelector('.messages').innerHTML = '';

    // Restablecer el estado del botón y limpiar el campo de mensaje
    updateSubmitButtonState(false);
  });

  // Función para actualizar el estado del botón "submit"
  const updateSubmitButtonState = (busy) => {
    const button = document.querySelector('[type="submit"]');
    button.textContent = busy ? 'Enviando...' : 'Enviar';
  };

  // Agregar eventos al formulario
  // Evento submit
  document.querySelector('.prompt-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const selectedModel = document.querySelector('.models').value;
    const message = document.querySelector('.message');
    const userContent = message.value;

    // Cambiar el estado del botón a ocupado
    updateSubmitButtonState(true);
    try {
      // Realizar la solicitud al backend
      const response = await fetch('api/models/' + encodeURIComponent(selectedModel) + '/message', {
        body: JSON.stringify({ systemMessage, messages, content: userContent }),
        method: 'POST',
        signal: controller.signal // Cuando se llama a abort(), fetch lanza una excepción "AbortError".
      });

      // Si la respuesta no es exitosa lanza una excepción
      if (response.status !== 200) {
        throw new Error('Error al realizar la solicitud al backend.');
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

      // Restablecer el estado del botón y limpiar el campo de mensaje
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
