import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { site } from '@/config/site';
import { reply, starterSuggestions } from '@/lib/chatEngine';
import { useUI } from '@/context/UIContext';
import { usePreferences } from '@/context/PreferencesContext';
import { track } from '@/services/analytics';
import { Icon } from '@/components/ui/Icon';
import { searchIndex } from '@/features/search/searchIndex';
import './ChatWidget.css';

const STORAGE_KEY = 'kiet:chat';

const welcome = (audienceLabel) => ({
  from: 'bot',
  text: `Assalamu alaikum and welcome! I'm the Kanachur assistant. ${
    audienceLabel ? `As a ${audienceLabel.toLowerCase()}, you` : 'You'
  } can ask me about admissions, programmes, fees, hostels, hospital appointments or campus visits.`,
  suggestions: starterSuggestions,
});

const loadHistory = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || 'null');
  } catch {
    return null;
  }
};

/**
 * Live-inquiry assistant. Answers instantly from site content (see lib/chatEngine)
 * and hands over to a human via phone, WhatsApp, email or a call-back request.
 */
export default function ChatWidget() {
  const { closeChat, openEnquiry } = useUI();
  const { audience, hasChosenAudience } = usePreferences();
  const [messages, setMessages] = useState(() => loadHistory() || [welcome(hasChosenAudience ? audience.label : '')]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      /* noop */
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => e.key === 'Escape' && closeChat();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [closeChat]);

  const send = (text) => {
    const clean = text.trim();
    if (!clean || typing) return;
    setMessages((m) => [...m, { from: 'user', text: clean }]);
    setInput('');
    setTyping(true);
    track('chat_message', { length: clean.length });
    // A short, natural pause before answering.
    setTimeout(() => {
      const answer = reply(clean, searchIndex);
      setMessages((m) => [...m, { from: 'bot', ...answer }]);
      setTyping(false);
    }, 550 + Math.min(900, clean.length * 12));
  };

  const reset = () => setMessages([welcome(hasChosenAudience ? audience.label : '')]);

  return (
    <section className="chat" role="dialog" aria-label="Kanachur assistant" aria-modal="false">
      <header className="chat__header">
        <span className="chat__avatar">
          <img src="/images/logo.webp" alt="" width="40" height="40" />
          <span className="chat__online" aria-hidden="true" />
        </span>
        <div>
          <strong>Kanachur Assistant</strong>
          <small>Instant answers · Team replies {site.contact.hours.split('·')[1]?.trim() || 'during office hours'}</small>
        </div>
        <button type="button" className="chat__icon" onClick={reset} aria-label="Start a new conversation" title="New conversation">
          <Icon name="edit" size={18} />
        </button>
        <button type="button" className="chat__icon" onClick={closeChat} aria-label="Close assistant">
          <Icon name="x" size={20} />
        </button>
      </header>

      <div className="chat__messages" ref={scrollRef} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`chat__msg chat__msg--${m.from}`}>
            <p>{m.text}</p>
            {m.links?.length > 0 && (
              <div className="chat__links">
                {m.links.map((l) =>
                  l.to ? (
                    <Link key={l.label} to={l.to} onClick={closeChat}>
                      {l.label} <Icon name="arrow-right" size={14} />
                    </Link>
                  ) : (
                    <a key={l.label} href={l.href}>
                      {l.label} <Icon name="arrow-right" size={14} />
                    </a>
                  ),
                )}
              </div>
            )}
            {m.handoff && (
              <div className="chat__handoff">
                <a href={site.contact.main.href}>
                  <Icon name="phone" size={16} /> Call
                </a>
                <a href={`https://wa.me/${site.contact.whatsapp}`} target="_blank" rel="noopener noreferrer">
                  <Icon name="whatsapp" size={16} /> WhatsApp
                </a>
                <a href={`mailto:${site.contact.deanEmail}`}>
                  <Icon name="mail" size={16} /> Email
                </a>
                <button
                  type="button"
                  onClick={() => {
                    closeChat();
                    openEnquiry('Call-back request from chat');
                  }}
                >
                  <Icon name="user" size={16} /> Request a call-back
                </button>
              </div>
            )}
            {m.suggestions?.length > 0 && i === messages.length - 1 && (
              <div className="chat__chips">
                {m.suggestions.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div className="chat__msg chat__msg--bot chat__typing" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <form
        className="chat__form"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <label htmlFor="chat-input" className="visually-hidden">
          Type your question
        </label>
        <input
          id="chat-input"
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about admissions, fees, hostel…"
          autoComplete="off"
          maxLength={300}
        />
        <button type="submit" aria-label="Send" disabled={!input.trim() || typing}>
          <Icon name="send" size={18} />
        </button>
      </form>
      <p className="chat__disclaimer">Automated answers from this website. For emergencies call {site.contact.emergency.label}.</p>
    </section>
  );
}
