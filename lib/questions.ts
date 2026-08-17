// Shared question registry and ranking/matching logic.
// Imported by both the client UI (app/page.tsx) and the server API routes
// (app/api/track, app/api/popular). Popularity is always tracked against these
// canonical ids — never against raw typed text — so the public home screen only
// ever surfaces clean, vetted questions.

/* Master question registry — every canonical question has a stable id. */
export const ALL_QUESTIONS: Record<string, string> = {
  reg1: 'How does team formation and the draft work?',
  reg2: 'Can two friends request to be on the same team?',
  reg3: "What if I can't afford the registration fee?",
  reg4: 'Can my daughter play up an age classification?',
  game1: 'What happens if a game is rained out?',
  game2: 'How many innings can my daughter sit out?',
  game3: 'How many pitching outs is a pitcher allowed per week?',
  game4: "What's the run rule / mercy rule?",
  uni1: 'What if my daughter forgets her jersey?',
  uni2: 'Are metal cleats allowed?',
  uni3: 'Does WVFP provide batting helmets?',
  uni4: 'What ball size is used for each age group?',
  star1: 'How are All-Star players selected?',
  star2: 'How much of the season do you need to play to be eligible for All-Stars?',
  star3: 'Can a player be selected for All-Stars in an older age group?',
  coach1: 'What happens if a coach is ejected by an umpire?',
  coach2: 'What are coaches expected to do on the sidelines?',
  coach3: 'Do coaches need a background check?',
  tourney1: "What's the pitching distance at tournaments?",
  tourney2: 'How long are tournament games?',
  tourney3: "What's the refund policy if a tournament is canceled?",
  tourney4: "Can I protest an umpire's call?",
  snack1: 'Who works the snack bar?',
  snack2: 'Are dogs allowed at the fields?',
  snack3: 'Can players under 18 handle the cash drawer?',
  about1: 'How is the WVFP Board structured?',
  about2: 'Does WVFP provide insurance coverage?',
  about3: 'What does a visiting team need to sign to practice on WVFP fields?',
};

export interface Category {
  id: string;
  title: string;
  blurb: string;
  icon: string;
  questionIds: string[];
}

export const CATEGORIES: Category[] = [
  { id: 'registration', title: 'Registration & Teams', blurb: 'Signing up, fees, friend requests, team formation', icon: 'clipboard', questionIds: ['reg1', 'reg2', 'reg3', 'reg4'] },
  { id: 'gameplay', title: 'Games & Playing Rules', blurb: 'Innings, rainouts, run rules, pitching limits', icon: 'diamond', questionIds: ['game1', 'game2', 'game3', 'game4'] },
  { id: 'uniforms', title: 'Uniforms & Equipment', blurb: 'Jerseys, cleats, helmets, bats, and gear rules', icon: 'shirt', questionIds: ['uni1', 'uni2', 'uni3', 'uni4'] },
  { id: 'allstars', title: 'All-Stars', blurb: 'How players and coaching staff get selected', icon: 'star', questionIds: ['star1', 'star2', 'star3'] },
  { id: 'coaches', title: 'Coaches & Conduct', blurb: 'Sideline expectations, ejections, background checks', icon: 'shield', questionIds: ['coach1', 'coach2', 'coach3'] },
  { id: 'tournaments', title: 'Tournaments (D1 Prospects)', blurb: 'Tournament-specific rules, distances, refunds', icon: 'trophy', questionIds: ['tourney1', 'tourney2', 'tourney3', 'tourney4'] },
  { id: 'snackbar', title: 'Snack Bar & Ballpark', blurb: 'Concessions, ballpark etiquette, game-day basics', icon: 'cup', questionIds: ['snack1', 'snack2', 'snack3'] },
  { id: 'about', title: 'About WVFP', blurb: 'Board structure, insurance, visiting teams', icon: 'info', questionIds: ['about1', 'about2', 'about3'] },
];

// Cold-start order for the home screen before real usage data exists —
// also used as the tie-breaker order once counts are equal.
export const DEFAULT_POPULAR_IDS = ['uni2', 'uni1', 'star1', 'reg2', 'coach1', 'tourney3'];
export const POPULAR_COUNT = 6;

const STOPWORDS = new Set([
  'the', 'and', 'for', 'are', 'what', 'how', 'can', 'does', 'do', 'is', 'my', 'a',
  'an', 'to', 'of', 'in', 'on', 'at', 'if', 'be', 'it', 'this', 'that', 'you', 'your',
]);

/* Ranks canonical ids by usage count, tie-broken by DEFAULT_POPULAR_IDS order. */
export function getRankedPopularIds(counts: Record<string, number>, limit: number): string[] {
  const scored = Object.keys(ALL_QUESTIONS).map((id) => ({
    id,
    count: counts[id] || 0,
    defaultRank: DEFAULT_POPULAR_IDS.indexOf(id),
  }));
  scored.sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count;
    const ad = a.defaultRank === -1 ? 999 : a.defaultRank;
    const bd = b.defaultRank === -1 ? 999 : b.defaultRank;
    return ad - bd;
  });
  return scored.slice(0, limit).map((s) => s.id);
}

function normalizeWords(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/* Local, no-network fuzzy match — credits a typed question toward the closest
   canonical id without ever storing the raw typed text anywhere shared. */
export function matchCanonicalId(typedText: string): string | null {
  const typedWords = new Set(normalizeWords(typedText));
  if (typedWords.size === 0) return null;
  let bestId: string | null = null;
  let bestScore = 0;
  Object.entries(ALL_QUESTIONS).forEach(([id, text]) => {
    const qWords = normalizeWords(text);
    if (qWords.length === 0) return;
    const overlap = qWords.filter((w) => typedWords.has(w)).length;
    const score = overlap / qWords.length;
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  });
  return bestScore >= 0.4 ? bestId : null;
}
