import { defineMiddleware } from 'astro:middleware';

const ADMIN_USER = import.meta.env.ADMIN_USER ?? 'admin';
const ADMIN_PASS = import.meta.env.ADMIN_PASS ?? 'changeme';

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/admin')) {
    return next();
  }

  const authHeader = context.request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    const encoded = authHeader.slice(6);
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8');
    const colon = decoded.indexOf(':');
    const user = decoded.slice(0, colon);
    const pass = decoded.slice(colon + 1);
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      return next();
    }
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="OSArchive Admin"'
    }
  });
});