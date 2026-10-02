import { buildSystemPrompt } from "./_prompt.js";

const MODEL = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
const MAX_CHARS = 500; // per message
const MAX_TURNS = 10; // conversation history sent upstream
const RATE_LIMIT = 10; // requests per IP per minute (best effort, per instance)

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

async function readBody(req) {
  if (req.body) return typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  let data = "";
  for await (const chunk of req) data += chunk;
  return JSON.parse(data || "{}");
}

function fail(res, status, message) {
  res.statusCode = status;
  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.end(message);
}

// POST { messages: [{ role: "user" | "assistant", text }] } → streamed plain text
export default async function handler(req, res) {
  if (req.method !== "POST") return fail(res, 405, "Method not allowed");

  const key = process.env.GEMINI_API_KEY;
  if (!key) return fail(res, 500, "The assistant isn't configured yet.");

  const ip = String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "")
    .split(",")[0].trim();
  if (rateLimited(ip)) return fail(res, 429, "Too many questions. Please try again in a minute.");

  let body;
  try {
    body = await readBody(req);
  } catch {
    return fail(res, 400, "Bad request");
  }

  const contents = (Array.isArray(body.messages) ? body.messages : [])
    .slice(-MAX_TURNS)
    .filter((m) => m && typeof m.text === "string" && m.text.trim())
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.text.slice(0, MAX_CHARS) }],
    }));
  if (!contents.length || contents.at(-1).role !== "user") {
    return fail(res, 400, "Ask a question first.");
  }

  const upstream = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?alt=sse`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: buildSystemPrompt() }] },
        contents,
        generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
      }),
    }
  ).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    const detail = upstream ? await upstream.text().catch(() => "") : "network error";
    console.error("Gemini request failed:", upstream?.status, detail.slice(0, 500));
    return fail(res, 502, "The assistant is unavailable right now. Please email Naveen instead.");
  }

  res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" });

  // Gemini streams SSE lines ("data: {...}"); forward only the answer text.
  const decoder = new TextDecoder();
  let buffer = "";
  for await (const chunk of upstream.body) {
    buffer += decoder.decode(chunk, { stream: true });
    let nl;
    while ((nl = buffer.indexOf("\n")) >= 0) {
      const line = buffer.slice(0, nl).trim();
      buffer = buffer.slice(nl + 1);
      if (!line.startsWith("data:")) continue;
      try {
        const parts = JSON.parse(line.slice(5)).candidates?.[0]?.content?.parts || [];
        const text = parts.filter((p) => !p.thought).map((p) => p.text || "").join("");
        if (text) res.write(text);
      } catch {
        // ignore partial / non-JSON lines
      }
    }
  }
  res.end();
}
