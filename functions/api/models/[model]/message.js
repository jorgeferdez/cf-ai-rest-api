import models from '../../../../models.js';

export async function onRequestPost (context) {
  const model = models.find((value) => { return value.model === decodeURIComponent(context.params.model); });
  const json = await context.request.json();
  const run = async () => {
    // El proveedor es Cloudflare
    if (model.provider === 'Cloudflare') {
      const messages = [];
      if (json.systemMessage) {
        messages.push({ role: 'system', content: json.systemMessage });
      }
      if (json.messages && json.messages.length >= 1) {
        messages.push(...json.messages);
      }
      messages.push({ role: 'user', content: json.content });
      const answer = await context.env.AI.run(model.url, {
        messages
      });
      return Response.json(answer);
    }

    // El proveedor es Google
    if (model.provider === 'Google') {
      const contents = [];
      if (json.systemMessage) {
        contents.push({ role: 'system', parts: [{ text: json.systemMessage }] });
      }
      if (json.messages && json.messages.length >= 1) {
        const messages = json.messages.map((value) => { return { role: value.role === 'user' ? 'user' : 'model', parts: [{ text: value.content }] }; });
        contents.push(...messages);
      }
      contents.push({ role: 'user', parts: [{ text: json.content }] });
      const response = await fetch(model.url + context.env.GEMINI_API_KEY, {
        method: 'POST',
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 1,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 8192,
            responseMimeType: 'text/plain'
          }
        })
      });
      return response;
    }
  };
  return run();
}
