import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // API routes — check for shared secret header
if (pathname.startsWith('/api')) {
  const secret = context.request.headers.get('x-api-secret');
  const expected = (context.locals.runtime?.env?.API_SECRET) ?? import.meta.env.API_SECRET;
  if (!expected || secret !== expected) {
    return new Response('Unauthorized', { status: 401 });
  }
  return next();
}

  // Admin UI — Basic Auth
  if (!pathname.startsWith('/admin')) {
    return next();
  }

  const ADMIN_USER = import.meta.env.ADMIN_USER ?? 'admin';
  const ADMIN_PASS = import.meta.env.ADMIN_PASS ?? 'pass';

  const authHeader = context.request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Basic ')) {
    try {
      const encoded = authHeader.slice(6);
      const binaryStr = globalThis.atob(encoded);
      const colon = binaryStr.indexOf(':');
      const user = binaryStr.slice(0, colon);
      const pass = binaryStr.slice(colon + 1);
      if (user === ADMIN_USER && pass === ADMIN_PASS) {
        return next();
      }
    } catch (e) {}
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="OSArchive Admin"',
      'Cache-Control': 'no-store'
    }
  });
});