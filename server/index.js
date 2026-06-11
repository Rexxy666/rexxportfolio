import "dotenv/config";
import express from "express";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import {
  createGenAIClient,
  FALLBACK_MODEL,
  getModel,
  isKeyFormatSupported,
} from "./geminiClient.js";

const app = express();
const PORT = process.env.API_PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "*";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", CORS_ORIGIN);
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});

app.use(express.json({ limit: "256kb" }));

const API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.GOOGLE_GENERATIVE_AI_API_KEY;

const MODEL = getModel();
const genAI = createGenAIClient(API_KEY);
const KEY_FORMAT_OK = isKeyFormatSupported(API_KEY);

const INVALID_KEY_MESSAGE =
  "無法辨識的金鑰格式。請使用 AI Studio（AIzaSy）或 AQ. 開頭的金鑰。";

function formatGeminiError(err) {
  const msg = err?.message || "Upstream model error.";
  if (
    msg.includes("401") ||
    msg.includes("Unauthorized") ||
    msg.includes("ACCESS_TOKEN_TYPE_UNSUPPORTED")
  ) {
    return "API 金鑰無效或未授權。請確認 .env 中的 GEMINI_API_KEY。";
  }
  if (msg.includes("429") || msg.toLowerCase().includes("quota")) {
    return [
      "Gemini API 配額已用完或請求過於頻繁。",
      "可至 https://aistudio.google.com/apikey 確認配額，或稍後再試。",
    ].join(" ");
  }
  if (msg.includes("API key not valid") || msg.includes("400")) {
    return "API 金鑰無效。請確認金鑰是否正確、未過期。";
  }
  if (msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("blocked")) {
    return "Gemini API 權限被拒（403）。請確認金鑰與模型 gemini-3.5-flash 是否可用。";
  }
  if (msg.includes("404") || msg.toLowerCase().includes("not found")) {
    return `模型「${MODEL}」可能不存在或你的金鑰無權使用。請確認 GEMINI_MODEL 設定。`;
  }
  return msg.length > 320 ? `${msg.slice(0, 320)}…` : msg;
}

if (API_KEY && !KEY_FORMAT_OK) {
  console.warn(`[rexx-api] ${INVALID_KEY_MESSAGE}`);
}

function normalizeChatMessages(raw) {
  if (!Array.isArray(raw)) return [];

  const cleaned = raw
    .filter((msg) => msg && typeof msg === "object")
    .map((msg) => {
      const role = msg.role === "assistant" || msg.role === "model" ? "assistant" : "user";
      const content = typeof msg.content === "string" ? msg.content.trim() : "";
      return { role, content };
    })
    .filter((msg) => msg.content.length > 0 && msg.content.length <= 8000);

  const merged = [];
  for (const msg of cleaned) {
    const prev = merged[merged.length - 1];
    if (prev && prev.role === msg.role) {
      prev.content = `${prev.content}\n\n${msg.content}`;
      continue;
    }
    merged.push({ ...msg });
  }

  return merged;
}

function toGenAIContents(messages) {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }],
  }));
}

function isModelOverloadError(err) {
  const msg = err?.message || "";
  return (
    err?.status === 503 ||
    msg.includes("503") ||
    msg.includes("UNAVAILABLE") ||
    msg.toLowerCase().includes("high demand") ||
    msg.toLowerCase().includes("overloaded")
  );
}

const GENERATION_CONFIG = {
  systemInstruction: SYSTEM_PROMPT,
  temperature: 0.65,
  maxOutputTokens: 1024,
};

async function createChatStream(model, contents) {
  return genAI.models.generateContentStream({
    model,
    contents,
    config: GENERATION_CONFIG,
  });
}

async function writeSdkStream(res, stream) {
  let accumulated = "";

  for await (const chunk of stream) {
    const text = chunk.text ?? "";
    if (!text) continue;

    let delta;
    if (text.length > accumulated.length && text.startsWith(accumulated)) {
      delta = text.slice(accumulated.length);
      accumulated = text;
    } else {
      delta = text;
      accumulated += text;
    }

    if (delta) {
      res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: "gemini",
    authMode: "studio",
    model: MODEL,
    fallbackModel: FALLBACK_MODEL,
    hasKey: Boolean(API_KEY),
    keyFormatOk: KEY_FORMAT_OK,
  });
});

app.post("/api/chat", async (req, res) => {
  if (!API_KEY) {
    res.status(503).json({
      error: "GEMINI_API_KEY is not configured. Add it to your .env file.",
    });
    return;
  }

  if (!KEY_FORMAT_OK || !genAI) {
    res.status(401).json({ error: INVALID_KEY_MESSAGE });
    return;
  }

  const messages = normalizeChatMessages(req.body?.messages);

  if (messages.length === 0 || messages.length > 40) {
    res.status(400).json({
      error: "Invalid messages payload. Send at least one non-empty user message.",
    });
    return;
  }

  const last = messages[messages.length - 1];
  if (last.role !== "user") {
    res.status(400).json({ error: "Last message must be from the user." });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const contents = toGenAIContents(messages);

  try {
    let stream;

    try {
      stream = await createChatStream(MODEL, contents);
    } catch (primaryErr) {
      if (isModelOverloadError(primaryErr) && MODEL !== FALLBACK_MODEL) {
        console.warn(
          `[rexx-api] Gemini ${MODEL} 繁忙，自動切換至 ${FALLBACK_MODEL} 備援方案。`,
          primaryErr.message,
        );
        stream = await createChatStream(FALLBACK_MODEL, contents);
      } else {
        throw primaryErr;
      }
    }

    await writeSdkStream(res, stream);
  } catch (err) {
    console.error("[rexx-api] Gemini error:", err);

    const overload = isModelOverloadError(err);
    const message = overload
      ? "Agent Rex 正在整理思緒，請稍等 5 秒後再次發送訊息！"
      : formatGeminiError(err);
    const status = overload
      ? 503
      : err?.message?.includes("429")
        ? 429
        : err?.message?.includes("401") || err?.message?.includes("Unauthorized")
          ? 401
          : err?.message?.includes("403") || err?.message?.includes("PERMISSION_DENIED")
            ? 403
            : 500;

    if (!res.headersSent) {
      res.status(status).json({ error: message });
      return;
    }
    res.write(`data: ${JSON.stringify({ error: message })}\n\n`);
    res.write("data: [DONE]\n\n");
    res.end();
  }
});

app.listen(PORT, () => {
  console.log(
    `[rexx-api] http://localhost:${PORT} (gemini-studio: ${MODEL} → fallback: ${FALLBACK_MODEL})`,
  );
});
