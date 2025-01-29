import models from '../../../models.js';

export async function onRequestGet (context) {
  return Response.json(models);
}
