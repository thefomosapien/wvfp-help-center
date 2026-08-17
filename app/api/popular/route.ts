import { NextResponse } from 'next/server';
import { ALL_QUESTIONS } from '@/lib/questions';
import { getKv, countKey } from '@/lib/kv';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// GET /api/popular
// Returns { id: count } for every canonical question. The client feeds this
// into getRankedPopularIds() to order the home-screen Popular Questions list.
export async function GET() {
  const ids = Object.keys(ALL_QUESTIONS);
  const counts: Record<string, number> = {};

  const kv = getKv();
  if (!kv) {
    // KV not configured — return all-zero counts so the client falls back to
    // the default order.
    for (const id of ids) counts[id] = 0;
    return NextResponse.json({ counts });
  }

  try {
    const keys = ids.map(countKey);
    const values = await kv.mget<(number | null)[]>(...keys);
    ids.forEach((id, i) => {
      counts[id] = Number(values[i] ?? 0);
    });
    return NextResponse.json({ counts });
  } catch (err) {
    console.error('popular mget error:', err);
    for (const id of ids) counts[id] = 0;
    return NextResponse.json({ counts });
  }
}
