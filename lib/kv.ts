// Thin wrapper around Vercel KV that degrades gracefully when KV isn't
// configured (e.g. local dev without env vars, or before the KV store is
// created in the Vercel dashboard). In that case tracking becomes a no-op and
// the Popular Questions list simply falls back to the default order — the rest
// of the app keeps working.
import { createClient, type VercelKV } from '@vercel/kv';

let client: VercelKV | null | undefined;

export function getKv(): VercelKV | null {
  if (client !== undefined) return client;

  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;

  if (!url || !token) {
    client = null;
    return client;
  }

  client = createClient({ url, token });
  return client;
}

export const countKey = (id: string) => `qcount:${id}`;
