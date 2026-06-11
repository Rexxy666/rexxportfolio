import { useCallback, useEffect, useRef, useState } from "react";
import { useChatStream } from "../../hooks/useChatStream";
import MarkdownMessage from "./MarkdownMessage";
import "./Chatbot.css";

const VIEWPORT_MARGIN = 10;
const DRAG_THRESHOLD = 5;
const PANEL_GAP = 76;

function getOrbSize() {
  return window.innerWidth <= 480 ? 58 : 64;
}

const COPY = {
  en: {
    subtitle: "RexxVisuals Brand Ambassador",
    placeholder: "Ask about Po Hsin, work, or collaboration…",
    send: "Send",
    welcome:
      "I'm **Agent Rex** — your guide to Po Hsin Hsiung's world at **RexxVisuals**. Ask about selected work, services, or how we collaborate.",
    chips: [
      { label: "🎬 View work", text: "Tell me about RexxVisuals' visual style and latest work." },
      { label: "🛠️ Tech & gear", text: "What are Po Hsin's strengths in cinematography and post-production?" },
      { label: "💼 Book a consult", text: "How do I start a collaboration or book a consult?" },
    ],
    resetTitle: "Clear conversation",
    closeTitle: "Close",
    orbLabel: "Open Agent Rex chat",
    orbLabelOpen: "Close Agent Rex chat",
  },
  zh: {
    subtitle: "RexxVisuals 品牌大使",
    placeholder: "問柏昕、作品或合作流程…",
    send: "送出",
    welcome:
      "我是 **Agent Rex** — 駐紮在 **RexxVisuals** 的 AI 品牌大使。想認識柏昕的作品、服務或合作方式，直接問我。",
    chips: [
      { label: "🎬 看作品", text: "介紹 RexxVisuals 的視覺風格與精選作品。" },
      { label: "🛠️ 技術實力", text: "柏昕在攝影與後期製作上有哪些核心優勢？" },
      { label: "💼 預約諮詢", text: "如果想合作或預約商業諮詢，流程是怎麼走的？" },
    ],
    resetTitle: "清除對話",
    closeTitle: "關閉",
    orbLabel: "開啟 Agent Rex 對話",
    orbLabelOpen: "關閉 Agent Rex 對話",
  },
};

function getDefaultPosition() {
  const size = getOrbSize();
  return {
    x: window.innerWidth - size - VIEWPORT_MARGIN,
    y: window.innerHeight - size - VIEWPORT_MARGIN,
  };
}

function clampPosition({ x, y }) {
  const size = getOrbSize();
  const maxX = window.innerWidth - size - VIEWPORT_MARGIN;
  const maxY = window.innerHeight - size - VIEWPORT_MARGIN;
  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(x, maxX)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(y, maxY)),
  };
}

function CloseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M1 1l12 12M13 1 1 13" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M13 8A5 5 0 1 1 8 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M8 1v3h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function AgentRexIcon({ mini = false }) {
  return (
    <span className={`agent-rex-icon ${mini ? "agent-rex-icon--mini" : ""}`} aria-hidden>
      <span className="agent-rex-icon__sphere">
        <span className="agent-rex-icon__base" />
        <span className="agent-rex-icon__sheen" />
        <span className="agent-rex-icon__highlight" />
      </span>
    </span>
  );
}

export default function Chatbot({ lang = "en" }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [position, setPosition] = useState(getDefaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const dragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });
  const t = COPY[lang] ?? COPY.en;
  const { messages, isStreaming, error, sendMessage, resetChat } = useChatStream();
  const [apiHint, setApiHint] = useState(null);

  const displayMessages =
    messages.length === 0
      ? [{ role: "assistant", content: t.welcome, isWelcome: true }]
      : messages;

  const clampAndSetPosition = useCallback((next) => {
    setPosition(clampPosition(next));
  }, []);

  useEffect(() => {
    const onResize = () => {
      setPosition((prev) => clampPosition(prev));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages, isStreaming, open]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => inputRef.current?.focus(), 320);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [open]);

  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 132)}px`;
  }, [input, open]);

  useEffect(() => {
    if (!open) return undefined;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/health");
        if (!res.ok) throw new Error("health");
        const data = await res.json();
        if (cancelled) return;
        if (!data.hasKey) {
          setApiHint(
            lang === "zh"
              ? "請在專案根目錄建立 .env，並設定 GEMINI_API_KEY（至 aistudio.google.com/apikey 申請）"
              : "Create a .env file with GEMINI_API_KEY (from aistudio.google.com/apikey)",
          );
        } else if (data.keyFormatOk === false) {
          setApiHint(
            lang === "zh"
              ? "金鑰格式無法辨識。請確認 GEMINI_API_KEY 為 AIzaSy 或 AQ. 開頭。"
              : "Unrecognized key format. GEMINI_API_KEY should start with AIzaSy or AQ.",
          );
        } else {
          setApiHint(null);
        }
      } catch {
        if (!cancelled) {
          setApiHint(
            lang === "zh"
              ? "AI 後端未啟動。請執行 npm run dev（同時啟動網站與 API）。"
              : "AI backend is offline. Run npm run dev to start both site and API.",
          );
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, lang]);

  const endDrag = useCallback(() => {
    const drag = dragRef.current;
    if (!drag.active) return;

    const wasClick = !drag.moved;
    drag.active = false;
    drag.moved = false;
    setIsDragging(false);

    if (wasClick) {
      setOpen((prev) => !prev);
    }
  }, []);

  const handleDragMove = useCallback(
    (clientX, clientY) => {
      const drag = dragRef.current;
      if (!drag.active) return;

      const dx = clientX - drag.startX;
      const dy = clientY - drag.startY;

      if (!drag.moved && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
        drag.moved = true;
        setIsDragging(true);
      }

      if (drag.moved) {
        clampAndSetPosition({
          x: drag.originX + dx,
          y: drag.originY + dy,
        });
      }
    },
    [clampAndSetPosition],
  );

  const startDrag = useCallback(
    (clientX, clientY) => {
      dragRef.current = {
        active: true,
        moved: false,
        startX: clientX,
        startY: clientY,
        originX: position.x,
        originY: position.y,
      };
    },
    [position.x, position.y],
  );

  useEffect(() => {
    const onMouseMove = (e) => handleDragMove(e.clientX, e.clientY);
    const onMouseUp = () => endDrag();
    const onTouchMove = (e) => {
      if (!dragRef.current.active) return;
      const touch = e.touches[0];
      if (!touch) return;
      e.preventDefault();
      handleDragMove(touch.clientX, touch.clientY);
    };
    const onTouchEnd = () => endDrag();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("touchcancel", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [handleDragMove, endDrag]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    if (!touch) return;
    startDrag(touch.clientX, touch.clientY);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const handleChip = (text) => {
    if (isStreaming) return;
    sendMessage(text);
  };

  const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
  const showTyping =
    isStreaming && (!lastAssistant || lastAssistant.content.length === 0);

  const panelStyle = {
    bottom: PANEL_GAP,
  };

  return (
    <div
      className="chatbot-root"
      style={{ left: position.x, top: position.y }}
      aria-live="polite"
    >
      <div
        className={`chatbot-panel ${open ? "open" : ""}`}
        style={panelStyle}
        role="dialog"
        aria-label="Agent Rex"
      >
        <header className="chatbot-header">
          <div className="chatbot-header-brand">
            <span className="chatbot-header-icon" aria-hidden>
              <AgentRexIcon mini />
            </span>
            <div className="chatbot-header-title">
              <strong>Agent Rex</strong>
              <span>{t.subtitle}</span>
            </div>
          </div>
          <div className="chatbot-header-actions">
            <button
              type="button"
              className="chatbot-icon-btn"
              onClick={resetChat}
              disabled={isStreaming || messages.length === 0}
              title={t.resetTitle}
              aria-label={t.resetTitle}
            >
              <ResetIcon />
            </button>
            <button
              type="button"
              className="chatbot-icon-btn"
              onClick={() => setOpen(false)}
              title={t.closeTitle}
              aria-label={t.closeTitle}
            >
              <CloseIcon />
            </button>
          </div>
        </header>

        <div className="chatbot-body" ref={bodyRef}>
          {displayMessages.map((msg, index) => (
            <div
              key={`${msg.role}-${index}`}
              className={`chat-msg ${msg.role}`}
            >
              <MarkdownMessage content={msg.content} />
            </div>
          ))}
          {showTyping ? (
            <div className="chat-msg assistant">
              <span className="chat-typing" aria-label="Typing">
                <span />
                <span />
                <span />
              </span>
            </div>
          ) : null}
        </div>

        {apiHint ? <p className="chatbot-error chatbot-hint">{apiHint}</p> : null}
        {error ? <p className="chatbot-error">{error}</p> : null}

        <div className="chatbot-chips">
          {t.chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              className="chatbot-chip"
              onClick={() => handleChip(chip.text)}
              disabled={isStreaming}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <form className="chatbot-footer" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            className="chatbot-input"
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder={t.placeholder}
            disabled={isStreaming}
            aria-label={t.placeholder}
          />
          <button type="submit" className="chatbot-send" disabled={isStreaming || !input.trim()}>
            {t.send}
          </button>
        </form>
      </div>

      <button
        type="button"
        className={`agent-rex-launcher ${open ? "is-open" : ""} ${isDragging ? "is-dragging" : ""}`}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        aria-label={open ? t.orbLabelOpen : t.orbLabel}
        aria-expanded={open}
      >
        <span className="agent-rex-launcher__float">
          <AgentRexIcon />
        </span>
      </button>
    </div>
  );
}
