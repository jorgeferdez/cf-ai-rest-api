export default {
    async fetch (request, env) {
        const url = new URL(request.url);

        if (url.pathname.startsWith('/test')) {
            return Response.json({ url: '/test' });
        }

        return env.ASSETS.fetch(request);
    }
}