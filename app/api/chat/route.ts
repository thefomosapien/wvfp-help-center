import { NextResponse } from 'next/server';
import { getSystemPrompt } from '@/lib/systemPrompt';
import { rateLimit, clientIp } from '@/lib/rateLimit';

export const runtime = 'nodejs';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const MAX_TOKENS = 1000;

interface ClientMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Optional origin allow-list. If ALLOWED_ORIGINS is set, only requests coming
// from those hosts are accepted (cheap insurance against off-site abuse).
function originAllowed(req: Request): boolean {
  const allowed = process.env.ALLOWED_ORIGINS;
  if (!allowed) return true;
  const hosts = allowed.split(',').map((s) => s.trim()).filter(Boolean);
  const source = req.headers.get('origin') || req.headers.get('referer') || '';
  if (!source) return false;
  try {
    const host = new URL(source).origin;
    return hosts.some((h) => host === h || host.endsWith(h.replace(/^https?:\/\//, '')));
  } catch {
    return false;
  }
}

function sanitizeMessages(input: unknown): ClientMessage[] | null {
  if (!Array.isArray(input) || input.length === 0) return null;
  const out: ClientMessage[] = [];
  for (const m of input) {
    if (
      !m ||
      typeof m !== 'object' ||
      (m.role !== 'user' && m.role !== 'assistant') ||
      typeof m.content !== 'string' ||
      m.content.length === 0
    ) {
      return null;
    }
    // Guard against absurdly large payloads.
    out.push({ role: m.role, content: m.content.slice(0, 4000) });
  }
  return out.slice(-20); // cap conversation length
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Server is not configured.' },
      { status: 500 },
    );
  }

  if (!originAllowed(req)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  const limit = rateLimit(clientIp(req));
  if (!limit.ok) {
    return NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const messages = sanitizeMessages((body as { messages?: unknown })?.messages);
  if (!messages) {
    return NextResponse.json({ error: 'Invalid messages.' }, { status: 400 });
  }

  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;

  try {
    const upstream = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: MAX_TOKENS,
        // cache_control on the large, reused system prompt drops the reused
        // portion to ~10% of input price after the first request.
        system: [
          {
            type: 'text',
            text: getSystemPrompt(),
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages,
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      console.error('Anthropic API error:', upstream.status, detail);
      return NextResponse.json(
        { error: 'The rules assistant is unavailable right now.' },
        { status: 502 },
      );
    }

    const data = await upstream.json();
    const answer =
      (data.content || [])
        .filter((b: { type: string }) => b.type === 'text')
        .map((b: { text: string }) => b.text)
        .join('\n\n')
        .trim() ||
      "I couldn't find an answer to that — try rephrasing, or check with a WVFP Board member.";

    return NextResponse.json({ answer });
  } catch (err) {
    console.error('Chat route error:', err);
    return NextResponse.json(
      { error: 'The rules assistant is unavailable right now.' },
      { status: 502 },
    );
  }
}
