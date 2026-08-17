// Best-effort in-memory per-IP rate limiter. Serverless instances are ephemeral
// and not shared, so this won't stop a distributed attack — but it's cheap
// insurance against a single client hammering the endpoint and running up a
// bill. For stronger guarantees, swap in Upstash Redis (see README).
const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 20; // per IP per window

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, retryAfter: 0 };
  }

  entry.count += 1;
  if (entry.count > MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  return { ok: true, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}
