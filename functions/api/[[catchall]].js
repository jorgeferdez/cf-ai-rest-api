export async function onRequest (context) {
  return Response.json({ message: 'No encontrado' }, { status: 404 });
}
