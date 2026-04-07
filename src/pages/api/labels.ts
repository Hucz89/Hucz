export const prerender = false;
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
  const serviceKey = (locals.runtime?.env?.SUPABASE_SERVICE_KEY) as string;
  const supabaseUrl = (locals.runtime?.env?.PUBLIC_SUPABASE_URL) as string;

  const body = await request.json();

  const res = await fetch(`${supabaseUrl}/rest/v1/labels`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`,
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  const serviceKey = (locals.runtime?.env?.SUPABASE_SERVICE_KEY) as string;
  const supabaseUrl = (locals.runtime?.env?.PUBLIC_SUPABASE_URL) as string;

  const { id } = await request.json();

  const res = await fetch(`${supabaseUrl}/rest/v1/labels?id=eq.${id}`, {
    method: 'DELETE',
    headers: {
      'apikey': serviceKey,
      'Authorization': `Bearer ${serviceKey}`
    }
  });

  return new Response(null, { status: res.status });
};