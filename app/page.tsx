'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ALL_QUESTIONS,
  CATEGORIES,
  POPULAR_COUNT,
  getRankedPopularIds,
  matchCanonicalId,
  type Category,
} from '@/lib/questions';
import { ICONS } from '@/lib/icons';

type AppState = 'home' | 'category' | 'chat';
type Role = 'user' | 'assistant';
interface Message {
  role: Role;
  content: string;
}

// Escape then apply the small subset of formatting the prototype supported:
// **bold**, blank-line paragraphs, and "-" bullet lists.
function formatBotText(text: string): string {
  let safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  safe = safe.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const blocks = safe.split(/\n{2,}/);
  let html = '';
  blocks.forEach((block) => {
    const lines = block.split('\n').filter((l) => l.trim().length);
    const isList = lines.length > 0 && lines.every((l) => /^\s*-\s+/.test(l));
    if (isList) {
      html += '<ul>' + lines.map((l) => '<li>' + l.replace(/^\s*-\s+/, '') + '</li>').join('') + '</ul>';
    } else {
      html += '<p>' + lines.join('<br>') + '</p>';
    }
  });
  return html || '<p></p>';
}

function BotIcon() {
  return (
    <svg className="bot-icon" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" fill="none" stroke="#14171A" strokeWidth="3" />
      <text x="50" y="61" textAnchor="middle" fontFamily="Oswald, sans-serif" fontWeight="700" fontSize="40" fill="#0FA8A2">
        W
      </text>
    </svg>
  );
}

export default function Page() {
  const [appState, setAppState] = useState<AppState>('home');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false); // waiting on the assistant
  const [input, setInput] = useState('');

  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Mirror of messages used inside async ask() to avoid stale closures.
  const historyRef = useRef<Message[]>([]);

  const loadCounts = useCallback(async () => {
    try {
      const res = await fetch('/api/popular');
      if (!res.ok) return;
      const data = await res.json();
      if (data && data.counts) setCounts(data.counts);
    } catch {
      /* leave counts as-is; ranking falls back to defaults */
    }
  }, []);

  // Load usage counts on first mount.
  useEffect(() => {
    loadCounts();
  }, [loadCounts]);

  // Keep the chat thread scrolled to the bottom as it grows.
  useEffect(() => {
    if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight;
  }, [messages, pending]);

  const autoGrow = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 110) + 'px';
  };

  const bumpCount = useCallback((id: string) => {
    if (!id || !ALL_QUESTIONS[id]) return;
    // Optimistically reflect the bump locally so the home list updates instantly.
    setCounts((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    }).catch((e) => console.error('Could not save usage count', e));
  }, []);

  const ask = useCallback(async (question: string) => {
    const userMsg: Message = { role: 'user', content: question };
    const nextHistory = [...historyRef.current, userMsg];
    historyRef.current = nextHistory;
    setMessages(nextHistory);
    setInput('');
    requestAnimationFrame(autoGrow);
    setPending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
      });
      if (!response.ok) throw new Error('Request failed: ' + response.status);
      const data = await response.json();
      const answer: string =
        (data && data.answer) ||
        "I couldn't find an answer to that — try rephrasing, or check with a WVFP Board member.";
      const withAnswer = [...historyRef.current, { role: 'assistant' as Role, content: answer }];
      historyRef.current = withAnswer;
      setMessages(withAnswer);
    } catch (err) {
      console.error('WVFP Rules Assistant error:', err);
      const withError = [
        ...historyRef.current,
        { role: 'assistant' as Role, content: '__ERROR__' },
      ];
      historyRef.current = withError;
      setMessages(withError);
    } finally {
      setPending(false);
    }
  }, []);

  const startChat = useCallback(
    (question: string, id?: string) => {
      setAppState('chat');
      historyRef.current = [];
      setMessages([]);
      const matchedId = id || matchCanonicalId(question);
      if (matchedId) bumpCount(matchedId);
      ask(question);
    },
    [ask, bumpCount],
  );

  const goHome = useCallback(() => {
    setAppState('home');
    setActiveCategory(null);
    historyRef.current = [];
    setMessages([]);
    // Refresh counts in case others have asked things since we loaded.
    loadCounts();
  }, [loadCounts]);

  const openCategory = (cat: Category) => {
    setActiveCategory(cat);
    setAppState('category');
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || pending) return;
    if (appState === 'chat') {
      ask(text);
    } else {
      startChat(text);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent);
    }
  };

  const placeholder =
    appState === 'home'
      ? 'Search rules or ask a question…'
      : appState === 'category' && activeCategory
        ? `Ask about ${activeCategory.title}…`
        : 'Ask a follow-up…';

  const popularIds = getRankedPopularIds(counts, POPULAR_COUNT);
  const showBrowse = appState !== 'chat';

  const QuestionRow = ({ id }: { id: string }) => {
    const text = ALL_QUESTIONS[id];
    if (!text) return null;
    return (
      <button type="button" className="popular-item" onClick={() => startChat(text, id)}>
        <span>{text}</span>
        <span className="chev">&rsaquo;</span>
      </button>
    );
  };

  return (
    <div className="app">
      <header>
        <div className="headings">
          <h1>
            West Valley Fastpitch <span>Rules Assistant</span>
          </h1>
        </div>
      </header>

      <div className="stitch" />

      <div className="intro">
        <p>
          Answers come from WVFP&apos;s Rules &amp; Regulations, By-Laws, waiver forms, and D1
          Prospects&apos; tournament rules — not an official ruling. For real disputes, the WVFP
          Board (or D1 Prospects for tournaments) has final say.
        </p>
      </div>

      {appState !== 'home' && (
        <div className="backrow">
          <button type="button" className="back-btn" onClick={goHome}>
            &larr; All topics
          </button>
        </div>
      )}

      {showBrowse ? (
        <div className="browse">
          {appState === 'home' && (
            <>
              <p className="section-label">Popular questions</p>
              <div className="popular-list">
                {popularIds.map((id) => (
                  <QuestionRow key={id} id={id} />
                ))}
              </div>
              <p className="section-label">Browse by category</p>
              <div className="category-grid">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    className="category-card"
                    onClick={() => openCategory(cat)}
                  >
                    <span className="cat-icon" dangerouslySetInnerHTML={{ __html: ICONS[cat.icon] }} />
                    <span className="cat-title">{cat.title}</span>
                    <span className="cat-blurb">{cat.blurb}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {appState === 'category' && activeCategory && (
            <>
              <div className="category-detail-head">
                <span
                  className="cat-icon"
                  dangerouslySetInnerHTML={{ __html: ICONS[activeCategory.icon] }}
                />
                <h2>{activeCategory.title}</h2>
                <p className="category-detail-blurb">{activeCategory.blurb}</p>
              </div>
              <p className="section-label">Common questions</p>
              <div className="popular-list">
                {activeCategory.questionIds.map((id) => (
                  <QuestionRow key={id} id={id} />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="thread" ref={threadRef}>
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="msg user">
                {m.content}
              </div>
            ) : (
              <div key={i} className="bot-row">
                <BotIcon />
                {m.content === '__ERROR__' ? (
                  <div className="bot-bubble error">
                    <p>Something went wrong reaching the rules assistant. Please try again in a moment.</p>
                  </div>
                ) : (
                  <div
                    className="bot-bubble"
                    dangerouslySetInnerHTML={{ __html: formatBotText(m.content) }}
                  />
                )}
              </div>
            ),
          )}
          {pending && (
            <div className="bot-row">
              <BotIcon />
              <div className="bot-bubble">
                <div className="typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <form className="inputbar" onSubmit={onSubmit}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          placeholder={placeholder}
          aria-label="Ask a question"
          onChange={(e) => {
            setInput(e.target.value);
            autoGrow();
          }}
          onKeyDown={onKeyDown}
        />
        <button className="send" type="submit" disabled={pending} aria-label="Send question">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="6 11 12 5 18 11" />
          </svg>
        </button>
      </form>
    </div>
  );
}
