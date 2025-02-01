export async function onRequest (context) {
  return Response.json({ message: 'Not found' }, { status: 404 });
}
