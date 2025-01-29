import models from '../../../../models.js';

export async function onRequestGet (context) {
  const model = models.find((value) => { return value.model === context.params.model; });
  return Response.json(model);
}
