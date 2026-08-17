import { NextResponse } from 'next/server';
import { ALL_QUESTIONS } from '@/lib/questions';
import { getKv, countKey } from '@/lib/kv';

export const runtime = 'nodejs';

// POST /api/track  body: { id }
// Increments the usage counter for a canonical question id. Only ids that exist
// in ALL_QUESTIONS are accepted — raw typed text is never counted here.
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }

  const id = (body as { id?: unknown })?.id;
  if (typeof id !== 'string' || !ALL_QUESTIONS[id]) {
    return NextResponse.json({ error: 'Unknown question id.' }, { status: 400 });
  }

  const kv = getKv();
  if (!kv) {
    // KV not configured — tracking is a no-op, but that's not a client error.
    return NextResponse.json({ ok: true, tracked: false });
  }

  try {
    await kv.incr(countKey(id));
    return NextResponse.json({ ok: true, tracked: true });
  } catch (err) {
    console.error('track incr error:', err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
