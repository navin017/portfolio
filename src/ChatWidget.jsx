import { useEffect, useRef, useState } from "react";

const SUGGESTIONS = [
  "What's Naveen's tech stack?",
  "Tell me about the CATMO project",
  "What real-time systems has Naveen built?",
  "Is Naveen open to new roles?",
];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  async function ask(question) {
    const text = question.trim();
    if (!text || busy) return;
    const history = [...messages, { role: "user", text }];
    setMessages([...history, { role: "assistant", text: "" }]);
    setInput("");
    setBusy(true);

    const update = (fn) =>
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = fn(next[next.length - 1]);
        return next;
      });

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });
      if (!res.ok || !res.body) {
        const msg = await res.text().catch(() => "");
        update((m) => ({ ...m, text: msg || "Something went wrong. Please try again.", error: true }));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        update((m) => ({ ...m, text: m.text + chunk }));
      }
      update((m) => (m.text ? m : { ...m, text: "I couldn't come up with an answer. Try rephrasing?", error: true }));
    } catch {
      update((m) => ({ ...m, text: "Network error. Please try again.", error: true }));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="chat">
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Ask AI about Naveen">
          <div className="chat-head">
            <div>
              <strong>Ask about Naveen</strong>
              <span>AI assistant · Powered by Gemini</span>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
          </div>

          <div className="chat-body" ref={listRef}>
            {messages.length === 0 ? (
              <div className="chat-empty">
                <p>
                  Hi! I can answer questions about Naveen's experience, skills, and projects. Try one of these:
                </p>
                {SUGGESTIONS.map((s) => (
                  <button key={s} className="chat-suggest" onClick={() => ask(s)}>{s}</button>
                ))}
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`msg ${m.role} ${m.error ? "error" : ""}`}>
                  {m.text || <span className="typing"><i /><i /><i /></span>}
                </div>
              ))
            )}
          </div>

          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              ask(input);
            }}
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              maxLength={500}
              aria-label="Your question"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send">➤</button>
          </form>
          <p className="chat-note">AI answers can be wrong. Please confirm important details with Naveen.</p>
        </div>
      )}

      <button className="chat-fab" onClick={() => setOpen(!open)} aria-expanded={open}>
        {open ? "✕" : "✦ Ask AI about me"}
      </button>
    </div>
  );
}
