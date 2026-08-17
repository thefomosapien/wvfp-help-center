// Thin wrapper around a Redis REST client (Upstash) that degrades gracefully
// when Redis isn't configured (e.g. local dev without env vars, or before the
// store is created in the Vercel dashboard). In that case tracking becomes a
// no-op and the Popular Questions list simply falls back to the default order —
// the rest of the app keeps working.
//
// Vercel KV was retired in favor of an Upstash-backed Redis integration from
// the Vercel Marketplace. Depending on which integration is connected, Vercel
// injects the REST credentials under either the KV_* names (legacy/compat) or
// the UPSTASH_REDIS_REST_* names — we accept both.
import { Redis } from '@upstash/redis';

let client: Redis | null | undefined;

function resolveConfig(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return { url, token };
}

export function getKv(): Redis | null {
  if (client !== undefined) return client;

  const cfg = resolveConfig();
  if (!cfg) {
    client = null;
    return client;
  }

  client = new Redis({ url: cfg.url, token: cfg.token });
  return client;
}

export const countKey = (id: string) => `qcount:${id}`;
