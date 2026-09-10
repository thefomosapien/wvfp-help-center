'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ALL_QUESTIONS, CATEGORIES, type Category } from '@/lib/questions';
import { ICONS } from '@/lib/icons';
import {
  DIVISIONS,
  DISCLAIMER,
  SOURCE_LABELS,
  type Division,
  type SourceTag,
} from '@/lib/divisions';

type AppState = 'home' | 'category' | 'division' | 'chat';
type HomeTab = 'divisions' | 'topics';
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
      <circle cx="50" cy="50" r="47" fill="none" stroke="#821415" strokeWidth="3" />
      <text x="50" y="62" textAnchor="middle" fontFamily="'Roboto Slab', serif" fontWeight="800" fontSize="40" fill="#B61816">
        W
      </text>
    </svg>
  );
}

// Header badge. Uses the official logo at /logo.png when present; falls back to
// a clean on-brand mark until the master logo file is added to /public.
function Logo() {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // If the image already failed before React hydrated (e.g. /logo.png is 404),
  // the onError event won't fire again — detect it on mount via naturalWidth.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div className="logo-fallback" role="img" aria-label="West Valley Fastpitch">
        WVFP
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      className="logo"
      src="/logo.png"
      alt="West Valley Fastpitch"
      width={52}
      height={52}
      onError={() => setFailed(true)}
    />
  );
}

export default function Page() {
  const [appState, setAppState] = useState<AppState>('home');
  const [homeTab, setHomeTab] = useState<HomeTab>('divisions');
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [activeDivision, setActiveDivision] = useState<Division | null>(null);
  const [openSecs, setOpenSecs] = useState<Record<string, boolean>>({});
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false); // waiting on the assistant
  const [input, setInput] = useState('');

  const threadRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Mirror of messages used inside async ask() to avoid stale closures.
  const historyRef = useRef<Message[]>([]);

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
    (question: string) => {
      setAppState('chat');
      historyRef.current = [];
      setMessages([]);
      ask(question);
    },
    [ask],
  );

  const goHome = useCallback(() => {
    setAppState('home');
    setActiveCategory(null);
    setActiveDivision(null);
    historyRef.current = [];
    setMessages([]);
  }, []);

  const openCategory = (cat: Category) => {
    setActiveCategory(cat);
    setAppState('category');
  };

  const openDivision = (div: Division) => {
    setActiveDivision(div);
    // Open the first subtopic by default, rest collapsed.
    const initial: Record<string, boolean> = {};
    div.subtopics.forEach((s, i) => {
      initial[s.id] = i === 0;
    });
    setOpenSecs(initial);
    setAppState('division');
  };

  const toggleSec = (id: string) => {
    setOpenSecs((prev) => ({ ...prev, [id]: !prev[id] }));
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
        : appState === 'division' && activeDivision
          ? `Ask about ${activeDivision.name} rules…`
          : 'Ask a follow-up…';

  const showBrowse = appState !== 'chat';

  const QuestionRow = ({ id }: { id: string }) => {
    const text = ALL_QUESTIONS[id];
    if (!text) return null;
    return (
      <button type="button" className="popular-item" onClick={() => startChat(text)}>
        <span>{text}</span>
        <span className="chev">&rsaquo;</span>
      </button>
    );
  };

  return (
    <div className={appState === 'chat' ? 'app chat' : 'app'}>
      <header>
        <Logo />
        <div className="headings">
          <p className="eyebrow">West Valley Fastpitch</p>
          <h1>Rules Assistant</h1>
        </div>
      </header>

      <div className="stitch" />

      {appState !== 'chat' && (
        <div className="intro">
          <p>
            Answers come from WVFP&apos;s Rules &amp; Regulations, By-Laws, waiver forms, and D1
            Prospects&apos; tournament rules — not an official ruling. For real disputes, the WVFP
            Board (or D1 Prospects for tournaments) has final say.
          </p>
        </div>
      )}

      {appState !== 'home' && (
        <div className="backrow">
          <button type="button" className="back-btn" onClick={goHome}>
            &larr; {appState === 'division' ? 'All divisions' : 'All topics'}
          </button>
        </div>
      )}

      {showBrowse ? (
        <div className="browse">
          {appState === 'home' && (
            <>
              <div className="tabs" role="tablist" aria-label="Browse mode">
                <button
                  type="button"
                  role="tab"
                  aria-selected={homeTab === 'divisions'}
                  className={homeTab === 'divisions' ? 'tab active' : 'tab'}
                  onClick={() => setHomeTab('divisions')}
                >
                  Rules by division
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={homeTab === 'topics'}
                  className={homeTab === 'topics' ? 'tab active' : 'tab'}
                  onClick={() => setHomeTab('topics')}
                >
                  Browse topics
                </button>
              </div>

              {homeTab === 'divisions' ? (
                <>
                  <p className="section-label">Rules by age division</p>
                  <div className="division-list">
                    {DIVISIONS.map((div) => (
                      <button
                        key={div.id}
                        type="button"
                        className="division-card"
                        onClick={() => openDivision(div)}
                      >
                        <span className="division-badge">{div.name}</span>
                        <span className="division-text">
                          <span className="division-ages">{div.ages}</span>
                          <span className="division-blurb">{div.blurb}</span>
                        </span>
                        <span className="chev">&rsaquo;</span>
                      </button>
                    ))}
                  </div>
                  <p className="reference-note">{DISCLAIMER}</p>
                </>
              ) : (
                <>
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
            </>
          )}

          {appState === 'division' && activeDivision && (
            <>
              <div className="category-detail-head">
                <span className="division-badge lg">{activeDivision.name}</span>
                <h2>{activeDivision.ages}</h2>
                <p className="category-detail-blurb">{activeDivision.blurb}</p>
              </div>
              <div className="accordion">
                {activeDivision.subtopics.map((sub) => {
                  const open = !!openSecs[sub.id];
                  return (
                    <div key={sub.id} className={open ? 'acc-item open' : 'acc-item'}>
                      <button
                        type="button"
                        className="acc-head"
                        aria-expanded={open}
                        onClick={() => toggleSec(sub.id)}
                      >
                        <span>{sub.title}</span>
                        <span className="acc-caret" aria-hidden="true">
                          {open ? '−' : '+'}
                        </span>
                      </button>
                      {open && (
                        <ul className="acc-body">
                          {sub.facts.map((f, i) => (
                            <li key={i}>
                              <span className="fact-text">{f.text}</span>
                              <span className={`src src-${f.source}`}>
                                {SOURCE_LABELS[f.source as SourceTag]}
                              </span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="reference-note">
                Not seeing what you need? Use the search bar below to ask the assistant.
              </p>
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
