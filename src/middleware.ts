import { defineMiddleware } from 'astro:middleware';

const ADMIN_USER = import.meta.env.ADMIN_USER ?? 'admin';
const ADMIN_PASS = import.meta.env.ADMIN_PASS ?? 'changeme';

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith('/admin')) {
    return next();
  }

  const authHeader = context.request.headers.get('authorization');

  if (authHeader) {
    const encoded = authHeader.replace('Basic ', '');
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(':');
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