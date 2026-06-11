import { useCallback, useState } from "react";

function toApiMessages(messages, userText) {
  const history = messages
    .filter(
      (msg) =>
        (msg.role === "user" || msg.role === "assistant") &&
        typeof msg.content === "string" &&
        msg.content.trim().length > 0,
    )
    .map((msg) => ({ role: msg.role, content: msg.content.trim() }));

  return [...history, { role: "user", content: userText }];
}

function parseSseChunk(buffer, onEvent) {
  const parts = buffer.split("\n\n");
  const remainder = parts.pop() ?? "";

  for (const part of parts) {
    const line = part
      .split("\n")
      .find((l) => l.startsWith("data: "))
      ?.slice(6);
    if (!line) continue;
    if (line === "[DONE]") {
      onEvent({ done: true });
      continue;
    }
    try {
      onEvent(JSON.parse(line));
    } catch {
      /* ignore malformed chunks */
    }
  }

  return remainder;
}

export function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;

    setError(null);
    const userMessage = { role: "user", content: trimmed };
    const apiMessages = toApiMessages(messages, trimmed);
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setIsStreaming(true);

    const assistantPlaceholder = { role: "assistant", content: "" };
    setMessages([...nextMessages, assistantPlaceholder]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        let detail = `Request failed (${response.status}).`;
        const raw = await response.text();
        try {
          const data = JSON.parse(raw);
          detail = data.error || detail;
        } catch {
          if (response.status === 502 || response.status === 504) {
            detail =
              "無法連線到 AI 後端。請在專案根目錄執行 npm run dev（會同時啟動網站與 API），不要只跑 vite。";
          } else if (raw) {
            detail = raw.slice(0, 200);
          }
        }
        throw new Error(detail);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Streaming is not supported in this browser.");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        buffer = parseSseChunk(buffer, (event) => {
          if (event.error) {
            setError(event.error);
            return;
          }
          if (event.content) {
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (last?.role === "assistant") {
                copy[copy.length - 1] = {
                  ...last,
                  content: last.content + event.content,
                };
              }
              return copy;
            });
          }
        });
      }

      buffer += decoder.decode();
      parseSseChunk(`${buffer}\n\n`, () => {});
    } catch (err) {
      const isNetwork =
        err instanceof TypeError ||
        err?.message?.includes("Failed to fetch") ||
        err?.message?.includes("NetworkError");
      setError(
        isNetwork
          ? "無法連線到 AI 服務。請確認已執行 npm run dev，且 API 在 port 3001 運行中。"
          : err.message || "Something went wrong.",
      );
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content) {
          return prev.slice(0, -1);
        }
        return prev;
      });
    } finally {
      setIsStreaming(false);
    }
  }, [isStreaming, messages]);

  const resetChat = useCallback(() => {
    if (isStreaming) return;
    setMessages([]);
    setError(null);
  }, [isStreaming]);

  return { messages, isStreaming, error, sendMessage, resetChat };
}
