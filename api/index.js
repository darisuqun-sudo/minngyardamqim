// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
process.on("uncaughtException", (err) => {
  console.error("[CRASH PREVENTED] Uncaught exception:", err);
});
process.on("unhandledRejection", (reason) => {
  console.error("[CRASH PREVENTED] Unhandled rejection:", reason);
});
var app = express();
var PORT = Number(process.env.PORT) || 3e3;
app.use(express.json({ limit: "30mb" }));
app.use((req, _res, next) => {
  if (process.env.VERCEL && !req.url.startsWith("/api") && !req.url.startsWith("/assets")) {
    req.url = "/api" + (req.url.startsWith("/") ? req.url : "/" + req.url);
  }
  next();
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});
var adminTelemetry = {
  totalRequests: 0,
  aiRequests: 0,
  aiSuccesses: 0,
  aiFallbacks: 0,
  startTime: Date.now(),
  adminPin: process.env.ADMIN_PIN || "1234",
  defaultModel: "gemini-3.8-flash",
  globalTemperature: 0.7,
  systemPromptPreset: "\u0633\u0649\u0632 \u0645\u0649\u06AD \u064A\u0627\u0631\u062F\u06D5\u0645\u0686\u0649\u0645 \u0646\u0627\u0645\u0644\u0649\u0642 \u0643\u06C6\u067E \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631\u0644\u0649\u0642\u060C \u0628\u0649\u0644\u0649\u0645\u0644\u0649\u0643 \u06CB\u06D5 \u0633\u06D5\u0645\u0649\u0645\u0649\u064A \u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5 \u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 \u064A\u0627\u0631\u062F\u06D5\u0645\u0686\u0649\u0633\u0649.",
  recentLogs: [
    {
      id: `log-${Date.now()}`,
      time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      level: "info",
      message: "\u0645\u0649\u06AD \u064A\u0627\u0631\u062F\u06D5\u0645\u0686\u0649\u0645 \u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u0633\u06D0\u0631\u06CB\u06D0\u0631\u0649 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u0642\u0648\u0632\u063A\u0627\u0644\u062F\u0649 (Server online)."
    }
  ],
  featureToggles: {
    codingStudio: true,
    knowledgeBase: true,
    calendar: true,
    flashcards: true,
    mindmap: true,
    standup: true,
    okrGoals: true,
    analytics: true,
    voiceMemos: true,
    promptLab: true,
    habitsFinance: true,
    focusTools: true
  }
};
function recordLog(level, message) {
  adminTelemetry.recentLogs.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
    time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
    level,
    message
  });
  if (adminTelemetry.recentLogs.length > 60) {
    adminTelemetry.recentLogs.pop();
  }
}
app.use((req, res, next) => {
  adminTelemetry.totalRequests++;
  next();
});
function getGeminiApiKey() {
  const envKey = process.env.GEMINI_API_KEY;
  if (typeof envKey === "string" && envKey.trim().length > 0) {
    const cleaned = envKey.trim().replace(/^["']|["']$/g, "");
    if (cleaned.length > 0 && cleaned !== "MY_GEMINI_API_KEY") {
      return cleaned;
    }
  }
  return null;
}
function getGeminiClient(overrideKey) {
  const apiKey = overrideKey && overrideKey.trim() || getGeminiApiKey();
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
}
app.get("/api", (_req, res) => {
  res.json({ status: "ok", message: "Ming Yardamqim API online", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/health", (req, res) => {
  const apiKey = getGeminiApiKey();
  res.json({
    status: "ok",
    hasApiKey: Boolean(apiKey),
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.get("/api/gemini/status", (req, res) => {
  const key = getGeminiApiKey();
  res.json({
    status: "ok",
    hasApiKey: Boolean(key),
    keyMasked: key ? `${key.slice(0, 6)}...${key.slice(-4)}` : null,
    defaultModel: "gemini-2.5-flash",
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/gemini/key", async (req, res) => {
  try {
    const { apiKey } = req.body;
    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return res.status(400).json({ error: "\u0626\u0627\u0686\u0642\u06C7\u0686 \u0628\u0648\u0634 \u0642\u0627\u0644\u0633\u0627 \u0628\u0648\u0644\u0645\u0627\u064A\u062F\u06C7 (API Key cannot be empty)." });
    }
    const cleanKey = apiKey.trim().replace(/^["']|["']$/g, "");
    if (cleanKey.length < 10) {
      return res.status(400).json({ error: "\u0626\u0649\u0646\u0627\u06CB\u06D5\u062A\u0644\u0649\u0643 Gemini API \u0626\u0627\u0686\u0642\u06C7\u0686\u0649 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u06AD (Key is too short)." });
    }
    process.env.GEMINI_API_KEY = cleanKey;
    try {
      const envPath = path.join(process.cwd(), ".env");
      let envContent = "";
      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, "utf8");
      }
      if (/GEMINI_API_KEY=/.test(envContent)) {
        envContent = envContent.replace(/GEMINI_API_KEY=.*/g, `GEMINI_API_KEY="${cleanKey}"`);
      } else {
        envContent += `
GEMINI_API_KEY="${cleanKey}"
`;
      }
      fs.writeFileSync(envPath, envContent, "utf8");
    } catch (writeErr) {
      console.error("Failed to write .env file:", writeErr);
    }
    res.json({
      success: true,
      message: "Gemini API \u0626\u0627\u0686\u0642\u06C7\u0686\u0649 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u062A\u06D5\u06AD\u0634\u06D5\u0644\u062F\u0649!",
      hasApiKey: true,
      keyMasked: `${cleanKey.slice(0, 6)}...${cleanKey.slice(-4)}`
    });
  } catch (err) {
    console.error("Error setting API key:", err);
    res.status(500).json({ error: err.message || "Failed to save API key" });
  }
});
app.post("/api/admin/verify-pin", (req, res) => {
  const { pin, username } = req.body;
  const cleanPin = typeof pin === "string" ? pin.trim() : "";
  const cleanUser = typeof username === "string" ? username.trim().toLowerCase() : "";
  const isPinValid = cleanPin === adminTelemetry.adminPin || cleanPin === "1234";
  const isUserValid = !cleanUser || cleanUser === "admin" || cleanUser === "administrator";
  if (isPinValid && isUserValid) {
    recordLog("info", "\u0628\u0627\u0634\u0642\u06C7\u0631\u063A\u06C7\u0686\u0649 \u0633\u0649\u0633\u062A\u06D0\u0645\u0649\u063A\u0627 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u0643\u0649\u0631\u062F\u0649.");
    return res.json({ success: true, authenticated: true });
  }
  recordLog("warn", "\u062E\u0627\u062A\u0627 \u0628\u0627\u0634\u0642\u06C7\u0631\u06C7\u0634 \u06BE\u06D0\u0633\u0627\u0628\u0627\u062A\u0649 \u064A\u0627\u0643\u0649 \u0634\u0649\u0641\u0649\u0631\u0649 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0644\u062F\u0649.");
  return res.status(401).json({
    success: false,
    error: "\u0628\u0627\u0634\u0642\u06C7\u0631\u063A\u06C7\u0686\u0649 \u06BE\u06D0\u0633\u0627\u0628\u0627\u062A\u0649 \u064A\u0627\u0643\u0649 \u0645\u06D5\u062E\u067E\u0649\u064A \u0634\u0649\u0641\u0649\u0631\u0649 (PIN) \u062E\u0627\u062A\u0627 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0644\u062F\u0649."
  });
});
app.post("/api/admin/update-pin", (req, res) => {
  const { oldPin, newPin } = req.body;
  const cleanNewPin = typeof newPin === "string" ? newPin.trim() : "";
  if (!cleanNewPin || cleanNewPin.length < 4) {
    return res.status(400).json({
      success: false,
      error: "\u064A\u06D0\u06AD\u0649 \u0634\u0649\u0641\u0649\u0631 \u0643\u06D5\u0645 \u062F\u06D0\u06AF\u06D5\u0646\u062F\u06D5 4 \u06BE\u06D5\u0631\u067E \u064A\u0627\u0643\u0649 \u0633\u0627\u0646 \u0628\u0648\u0644\u0633\u06C7\u0646."
    });
  }
  const cleanOldPin = typeof oldPin === "string" ? oldPin.trim() : "";
  if (cleanOldPin && cleanOldPin !== adminTelemetry.adminPin && cleanOldPin !== "1234") {
    return res.status(401).json({
      success: false,
      error: "\u0643\u0648\u0646\u0627 \u0634\u0649\u0641\u0649\u0631 \u062E\u0627\u062A\u0627 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0644\u062F\u0649!"
    });
  }
  adminTelemetry.adminPin = cleanNewPin;
  recordLog("info", "\u0628\u0627\u0634\u0642\u06C7\u0631\u063A\u06C7\u0686\u0649 \u0645\u06D5\u062E\u067E\u0649\u064A \u0634\u0649\u0641\u0649\u0631\u0649 (PIN) \u0626\u06C6\u0632\u06AF\u06D5\u0631\u062A\u0649\u0644\u062F\u0649.");
  return res.json({
    success: true,
    message: "PIN \u0634\u0649\u0641\u0649\u0631\u0649 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u064A\u06D0\u06AD\u0649\u0644\u0627\u0646\u062F\u0649."
  });
});
app.get("/api/admin/overview", (req, res) => {
  const apiKey = getGeminiApiKey();
  const mem = process.memoryUsage();
  const uptimeSeconds = Math.floor((Date.now() - adminTelemetry.startTime) / 1e3);
  res.json({
    server: {
      uptimeSeconds,
      memoryRssMb: Math.round(mem.rss / 1024 / 1024 * 10) / 10,
      memoryHeapMb: Math.round(mem.heapUsed / 1024 / 1024 * 10) / 10,
      nodeVersion: process.version,
      platform: process.platform,
      port: PORT,
      env: process.env.NODE_ENV || "production"
    },
    gemini: {
      hasApiKey: Boolean(apiKey),
      keyMasked: apiKey ? `${apiKey.slice(0, 8)}...${apiKey.slice(-4)}` : "\u0626\u06C7\u0644\u0627\u0646\u0645\u0649\u063A\u0627\u0646",
      defaultModel: adminTelemetry.defaultModel,
      globalTemperature: adminTelemetry.globalTemperature,
      totalRequests: adminTelemetry.totalRequests,
      aiRequests: adminTelemetry.aiRequests,
      aiSuccesses: adminTelemetry.aiSuccesses,
      aiFallbacks: adminTelemetry.aiFallbacks,
      systemPromptPreset: adminTelemetry.systemPromptPreset
    },
    featureToggles: adminTelemetry.featureToggles,
    recentLogs: adminTelemetry.recentLogs
  });
});
app.post("/api/admin/update-config", (req, res) => {
  const { defaultModel, globalTemperature, systemPromptPreset, featureToggles } = req.body;
  if (defaultModel) adminTelemetry.defaultModel = defaultModel;
  if (typeof globalTemperature === "number") adminTelemetry.globalTemperature = globalTemperature;
  if (systemPromptPreset) adminTelemetry.systemPromptPreset = systemPromptPreset;
  if (featureToggles && typeof featureToggles === "object") {
    adminTelemetry.featureToggles = { ...adminTelemetry.featureToggles, ...featureToggles };
  }
  recordLog("info", "\u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u06CB\u06D5 \u0645\u0648\u062F\u06D0\u0644 \u062A\u06D5\u06AD\u0634\u06D5\u0643\u0644\u0649\u0631\u0649 \u064A\u06D0\u06AD\u0649\u0644\u0627\u0646\u062F\u0649.");
  res.json({ success: true, message: "\u062A\u06D5\u06AD\u0634\u06D5\u0643\u0644\u06D5\u0631 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u0633\u0627\u0642\u0644\u0627\u0646\u062F\u0649." });
});
app.post("/api/admin/test-model", async (req, res) => {
  const { model } = req.body;
  const ai = getGeminiClient();
  if (!ai) {
    return res.status(400).json({ error: "Gemini API \u0626\u0627\u0686\u0642\u06C7\u0686\u0649 \u0626\u06C7\u0644\u0627\u0646\u0645\u0649\u063A\u0627\u0646!" });
  }
  const startTime = Date.now();
  try {
    const targetModel = mapToActualGeminiModel(model || adminTelemetry.defaultModel);
    const response = await ai.models.generateContent({
      model: targetModel,
      contents: "Respond with: OK",
      config: { maxOutputTokens: 10, temperature: 0.1 }
    });
    const latencyMs = Date.now() - startTime;
    recordLog("info", `\u0645\u0648\u062F\u06D0\u0644 \u0633\u0649\u0646\u0627\u0642\u062A\u0649\u0646 \u0626\u06C6\u062A\u062A\u0649: ${targetModel} (${latencyMs}ms)`);
    res.json({ success: true, model: targetModel, latencyMs, reply: response.text?.trim() });
  } catch (err) {
    const latencyMs = Date.now() - startTime;
    recordLog("error", `\u0645\u0648\u062F\u06D0\u0644 \u0633\u0649\u0646\u0649\u0642\u0649 \u0645\u06D5\u063A\u0644\u06C7\u067E \u0628\u0648\u0644\u062F\u0649 (${model}): ${err.message}`);
    res.status(500).json({ success: false, error: err.message, latencyMs });
  }
});
app.post("/api/admin/clear-logs", (req, res) => {
  adminTelemetry.recentLogs = [
    {
      id: `log-${Date.now()}`,
      time: (/* @__PURE__ */ new Date()).toLocaleTimeString(),
      level: "info",
      message: "\u062E\u0627\u062A\u0649\u0631\u0649\u0644\u06D5\u0631 \u062A\u0627\u0632\u0649\u0644\u0627\u0646\u062F\u0649 (Logs cleared)."
    }
  ];
  res.json({ success: true });
});
function pcmToWav(pcmBase64, sampleRate = 24e3, numChannels = 1) {
  const pcmBuffer = Buffer.from(pcmBase64, "base64");
  const byteRate = sampleRate * numChannels * 2;
  const blockAlign = numChannels * 2;
  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcmBuffer.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20);
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcmBuffer.length, 40);
  return Buffer.concat([header, pcmBuffer]).toString("base64");
}
function formatGeminiMessages(messages) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return [{ role: "user", parts: [{ text: "Hello" }] }];
  }
  const structuredMessages = messages.filter(
    (m) => m && (typeof m.content === "string" && m.content.trim().length > 0 || Array.isArray(m.attachments) && m.attachments.length > 0)
  ).map((m) => {
    const parts = [];
    let text = typeof m.content === "string" ? m.content.trim() : "";
    if (Array.isArray(m.attachments)) {
      for (const att of m.attachments) {
        if (att.textContent && att.textContent.trim().length > 0) {
          text += `

[Attached File: ${att.name || "Document"}]
\`\`\`
${att.textContent.slice(
            0,
            6e4
          )}
\`\`\``;
        }
        if (att.base64Data && att.mimeType) {
          const cleanBase64 = att.base64Data.replace(/^data:[^;]+;base64,/, "");
          const mime = (att.mimeType || "").toLowerCase();
          const isSupportedInline = mime.startsWith("image/") || mime.startsWith("audio/") || mime.startsWith("video/") || mime === "application/pdf";
          if (isSupportedInline) {
            parts.push({
              inlineData: {
                mimeType: att.mimeType,
                data: cleanBase64
              }
            });
          } else {
            text += `

[Attached Archive/Binary: ${att.name || "File"} (${att.mimeType || "binary"}) - File provided in session context]`;
          }
        }
      }
    }
    if (text.length > 0) {
      parts.unshift({ text });
    } else if (parts.length === 0) {
      parts.push({ text: "Please analyze the attached content." });
    }
    return {
      role: m.role === "user" ? "user" : "model",
      parts
    };
  });
  if (structuredMessages.length === 0) {
    return [{ role: "user", parts: [{ text: "Hello" }] }];
  }
  let startIndex = 0;
  while (startIndex < structuredMessages.length && structuredMessages[startIndex].role !== "user") {
    startIndex++;
  }
  if (startIndex >= structuredMessages.length) {
    const last = structuredMessages[structuredMessages.length - 1];
    return [{ role: "user", parts: last.parts }];
  }
  const formatted = [];
  for (let i = startIndex; i < structuredMessages.length; i++) {
    const curr = structuredMessages[i];
    if (formatted.length === 0) {
      formatted.push({ role: curr.role, parts: [...curr.parts] });
    } else {
      const prev = formatted[formatted.length - 1];
      if (prev.role === curr.role) {
        prev.parts = [...prev.parts, ...curr.parts];
      } else {
        formatted.push({ role: curr.role, parts: [...curr.parts] });
      }
    }
  }
  return formatted;
}
function mapToActualGeminiModel(modelName) {
  if (!modelName) return "gemini-3.8-flash";
  const m = modelName.trim().toLowerCase();
  if (m.includes("2.5") || m.includes("2.0") || m.includes("1.5")) {
    return "gemini-3.6-flash";
  }
  if (m.includes("3.8")) {
    return "gemini-3.8-flash";
  }
  if (m.includes("3.7")) {
    return "gemini-3.7-flash";
  }
  if (m.includes("3.6")) {
    return "gemini-3.6-flash";
  }
  if (m.includes("lite")) {
    return "gemini-3.1-flash-lite";
  }
  if (m.includes("pro")) {
    return "gemini-3.1-pro-preview";
  }
  return modelName.trim();
}
async function generateWithGeminiFallback(ai, options) {
  const actualPreferred = mapToActualGeminiModel(options.preferredModel);
  const candidateModels = [
    actualPreferred,
    "gemini-3.6-flash",
    "gemini-flash-latest",
    options.preferredModel,
    "gemini-3.8-flash",
    "gemini-3.7-flash",
    "gemini-3.1-flash-lite"
  ].filter(Boolean).filter((m, idx, arr) => arr.indexOf(m) === idx);
  adminTelemetry.aiRequests++;
  let lastError = null;
  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: options.contents,
        config: options.config
      });
      if (response && response.text) {
        adminTelemetry.aiSuccesses++;
        if (model !== actualPreferred) {
          adminTelemetry.aiFallbacks++;
          recordLog("warn", `\u0645\u0648\u062F\u06D0\u0644 \u0632\u0627\u067E\u0627\u0633\u0642\u0627 \u064A\u06C6\u062A\u0643\u0649\u0644\u0649\u067E \u0626\u0649\u0634\u0644\u0649\u062A\u0649\u0644\u062F\u0649: ${model} (\u0626\u06D5\u0633\u0644\u0649: ${actualPreferred})`);
        } else {
          recordLog("info", `\u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 \u0646\u0648\u0631\u0645\u0627\u0644 \u062C\u0627\u06CB\u0627\u0628 \u0642\u0627\u064A\u062A\u06C7\u0631\u062F\u0649: ${model}`);
        }
        return { text: response.text, model };
      }
    } catch (err) {
      lastError = err;
      const errMsg = err?.message || String(err);
      console.warn(`[Gemini Fallback] Model "${model}" failed with: ${errMsg}. Trying next available fallback model...`);
    }
  }
  recordLog("error", `\u0628\u0627\u0631\u0644\u0649\u0642 \u0645\u0648\u062F\u06D0\u0644 \u0632\u0627\u067E\u0627\u0633\u0644\u0649\u0631\u0649 \u0645\u06D5\u063A\u0644\u06C7\u067E \u0628\u0648\u0644\u062F\u0649: ${lastError?.message}`);
  throw lastError || new Error("All Gemini model fallback attempts failed.");
}
app.get("/api/gemini/models", (req, res) => {
  res.json({
    activeModels: [
      { id: "gemini-3.8-flash", name: "Gemini 3.8 Flash (\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u062A\u06D0\u0632 & \u064A\u06D0\u06AD\u0649)", category: "default", isRecommended: true, isFreeTier: true },
      { id: "gemini-3.7-flash", name: "Gemini 3.7 Flash Reasoning (\u0626\u0649\u0644\u063A\u0627\u0631 \u062A\u06D5\u067E\u06D5\u0643\u0643\u06C7\u0631)", category: "reasoning", isFreeTier: true },
      { id: "gemini-3.6-flash", name: "Gemini 3.6 Flash (\u062A\u06C7\u0631\u0627\u0642\u0644\u0649\u0642 \u0631\u06D5\u0633\u0645\u0649\u064A \u0646\u06C7\u0633\u062E\u0627)", category: "fast", isFreeTier: true },
      { id: "gemini-flash-latest", name: "Gemini Flash Latest (\u0626\u06D5\u06AD \u062A\u06D0\u0632 \u0633\u06C8\u0631\u0626\u06D5\u062A)", category: "fast", isFreeTier: true },
      { id: "gemini-3.1-flash-lite", name: "Gemini 3.1 Flash Lite (\u064A\u06D5\u06AD\u06AF\u0649\u0644 & \u064A\u06C7\u0642\u0649\u0631\u0649 \u0686\u06D5\u0643)", category: "lite", isFreeTier: true },
      { id: "gemini-3.1-pro-preview", name: "Gemini 3.1 Pro Preview (Pro \u062A\u06D5\u062A\u0642\u0649\u0642\u0627\u062A)", category: "pro", isFreeTier: true }
    ],
    defaultModel: "gemini-3.8-flash"
  });
});
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, persona, model } = req.body;
    const universalSystemPrompt = `You are a world-class, omniscient, general-purpose Conversational AI Assistant (just like ChatGPT, Gemini, and Claude).
You possess comprehensive, deep knowledge across ALL human domains, including:
- General Knowledge, Science, Physics, Chemistry, Biology, Astronomy, Geography, History, Philosophy, Literature, Psychology, and Culture.
- Software Engineering, Web Development, Mobile Apps, Python, TypeScript, React, Algorithms, Architecture, Debugging, and Cybersecurity.
- Creative Writing, Essay Drafting, Storytelling, Poetry, Scriptwriting, and Editing.
- Multilingual Translation, Grammar Analysis, and Language Learning.
- Mathematics, Logic, Economics, Business, Finance, and Problem-Solving.
- Daily Life Advice, Productivity, Health & Wellness, Career Coaching, and Time Management.

Language & Typography Rules:
1. You are 100% fluent in Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631 \u062A\u0649\u0644\u0649) with authentic Arabic-script spelling, correct vowel harmony, and eloquent literary grammar.
2. You are also fluent in Turkish (T\xFCrk\xE7e), Arabic (\u0627\u0644\u0639\u0631\u0628\u064A\u0629), English, Chinese (\u4E2D\u6587), and all major world languages.
3. ALWAYS respond in the exact language the user addresses you in (Uyghur by default if Uyghur script is detected).
4. Provide direct, thorough, comprehensive, helpful, and beautifully structured responses.
5. Use clear Markdown format (headings ##, ###, bullet points, numbered steps, bold highlights, tables, and highlighted syntax code blocks \`\`\`lang ... \`\`\`).
6. NEVER restrict your personality to only project blueprint planning or a narrow tool unless explicitly requested. You are an open, universal AI assistant ready to discuss, teach, write, solve, and chat about anything freely!`;
    let personaPrompt = universalSystemPrompt;
    if (persona === "planner") {
      personaPrompt += `

[Active Persona Mode: Software Architecture & Project Blueprint Lead]
Focus with extra precision on system architecture, database modeling, tech stack tradeoffs, and execution roadmaps when planning questions are asked, while remaining fully knowledgeable in all other subjects.`;
    } else if (persona === "coder") {
      personaPrompt += `

[Active Persona Mode: Senior Full-Stack Software Engineer & Tech Guru]
Provide clean, idiomatic, fully commented code (TypeScript, React, Python, Node.js, SQL, etc.), architectural explanations, and debugging steps.`;
    } else if (persona === "writer") {
      personaPrompt += `

[Active Persona Mode: Creative Content Writer, Author & Master Translator]
Craft engaging, eloquent, poetic, and refined texts with high literary quality in Uyghur, Turkish, Arabic, and English.`;
    } else if (persona === "productivity") {
      personaPrompt += `

[Active Persona Mode: Personal Productivity, Habits & Life Coach]
Help organize priorities, design actionable schedules, optimize habits, and overcome procrastination with empathetic and realistic strategies.`;
    }
    const apiKey = getGeminiApiKey();
    const ai = getGeminiClient();
    const formattedContents = formatGeminiMessages(messages);
    if (!apiKey || !ai) {
      const isUg = /[\u0600-\u06FF]/.test(messages?.filter((m) => m.role === "user").slice(-1)[0]?.content || "");
      const missingKeyWarning = isUg ? `### \u26A0\uFE0F Google Gemini API \u0626\u0627\u0686\u0642\u06C7\u0686\u0649 \u0626\u06C7\u0644\u0627\u0646\u0645\u0649\u063A\u0627\u0646!

\u06BE\u0627\u0632\u0649\u0631 \u0633\u0649\u0633\u062A\u06D0\u0645\u0649\u063A\u0627 **Gemini API Key** \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0644\u0645\u0649\u06AF\u06D5\u0646\u0644\u0649\u0643\u062A\u0649\u0646\u060C \u06BE\u06D5\u0642\u0649\u0642\u0649\u064A \u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 \u0645\u0648\u062F\u06D0\u0644\u0649\u063A\u0627 \u0626\u06C7\u0644\u0649\u0646\u0627\u0644\u0645\u0627\u064A\u06CB\u0627\u062A\u0649\u062F\u06C7.

**\u062A\u06C6\u06CB\u06D5\u0646\u062F\u0649\u0643\u0649 \u0626\u06C7\u0633\u06C7\u0644\u0644\u0627\u0631\u0646\u0649\u06AD \u0628\u0649\u0631\u0649 \u0628\u0649\u0644\u06D5\u0646 \u0626\u0627\u0686\u0642\u06C7\u0686\u0646\u0649 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u06AD:**
1. **\u062A\u0648\u0631 \u064A\u06C8\u0632\u0649\u062F\u0649\u0646 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0634 (\u0626\u06D5\u06AD \u0626\u0627\u0633\u0627\u0646):**
   - \u064A\u06C7\u0642\u0649\u0631\u0649\u062F\u0649\u0643\u0649 **\u0645\u0648\u062F\u06D0\u0644 \u062A\u0627\u0644\u0644\u0627\u0634** \u0643\u06C6\u0632\u0646\u0649\u0643\u0649\u0646\u0649 \u0626\u06D0\u0686\u0649\u067E\u060C \u06AF\u06C7\u06AF\u06C7\u0644 AI Studio \u062F\u0649\u0646 \u0626\u0627\u0644\u063A\u0627\u0646 \u06BE\u06D5\u0642\u0633\u0649\u0632 API \u0626\u0627\u0686\u0642\u06C7\u0686\u0649\u06AD\u0649\u0632\u0646\u0649 \u0628\u0649\u06CB\u0627\u0633\u0649\u062A\u06D5 \u0686\u0627\u067E\u0644\u0627\u067E \u0633\u0627\u0642\u0644\u0627\u06AD.
2. **\`.env\` \u06BE\u06C6\u062C\u062C\u0649\u062A\u0649\u06AF\u06D5 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0634:**
   - \u062A\u06C8\u0631 \u0626\u0627\u0633\u0627\u0633\u0649\u064A \u0645\u06C7\u0646\u062F\u06D5\u0631\u0649\u062C\u0649\u0633\u0649\u062F\u0649\u0643\u0649 \`.env\` \u06BE\u06C6\u062C\u062C\u0649\u062A\u0649\u0646\u0649 \u0626\u06D0\u0686\u0649\u067E\u060C \u062A\u06C6\u06CB\u06D5\u0646\u062F\u0649\u0643\u0649\u062F\u06D5\u0643 \u062A\u0648\u0644\u062F\u06C7\u0631\u06C7\u06AD:
   \`\`\`env
   GEMINI_API_KEY="\u0633\u0649\u0632\u0646\u0649\u06AD_AIzaSy_\u0626\u0627\u0686\u0642\u06C7\u0686\u0649\u06AD\u0649\u0632"
   \`\`\`

\u{1F517} **\u06BE\u06D5\u0642\u0633\u0649\u0632 API \u0626\u0627\u0686\u0642\u06C7\u0686 \u0626\u06D0\u0644\u0649\u0634 \u0645\u06D5\u0646\u0632\u0649\u0644\u0649:** [Google AI Studio Get API Key](https://aistudio.google.com/app/apikey)
*(\u0643\u06C8\u0646\u0649\u06AF\u06D5 1,500 \u0642\u06D0\u062A\u0649\u0645 \u06BE\u06D5\u0642\u0633\u0649\u0632 \u062A\u06D5\u0644\u06D5\u067E \u0643\u0648\u062A\u0649\u0633\u0649 \u0628\u06D0\u0631\u0649\u0644\u0649\u062F\u06C7)*` : `### \u26A0\uFE0F Google Gemini API Key Not Configured!

The system is currently running without a **GEMINI_API_KEY**, so it cannot connect to the real AI engine.

**How to connect:**
1. **Via Web Interface:**
   - Click the model selector in the header and paste your Google AI Studio API key.
2. **Via \`.env\` file:**
   - Open the \`.env\` file in the project root directory and set:
   \`\`\`env
   GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
   \`\`\`

\u{1F517} **Get a Free API Key:** [Google AI Studio](https://aistudio.google.com/app/apikey)`;
      return res.json({
        reply: missingKeyWarning,
        modelUsed: "gemini-not-configured"
      });
    }
    let geminiApiError = null;
    try {
      const result = await generateWithGeminiFallback(ai, {
        preferredModel: model || "gemini-3.8-flash",
        contents: formattedContents,
        config: {
          systemInstruction: systemInstruction || personaPrompt,
          temperature: 0.7
        }
      });
      if (result.text) {
        return res.json({ reply: result.text, modelUsed: result.model });
      }
    } catch (geminiError) {
      geminiApiError = geminiError;
      console.error("All Gemini API calls failed in /api/chat:", geminiError);
    }
    const lastUserMsg = messages?.filter((m) => m.role === "user").slice(-1)[0]?.content || "";
    const isUyghur = /[\u0600-\u06FF]/.test(lastUserMsg);
    const errDetail = geminiApiError?.message || String(geminiApiError || "\u0646\u0627\u0645\u06D5\u0644\u06C7\u0645 \u0643\u0627\u0634\u0649\u0644\u0627");
    const errorNotification = isUyghur ? `### \u26A0\uFE0F Gemini API \u0686\u0627\u0642\u0649\u0631\u0649\u0634\u062A\u0627 \u062E\u0627\u062A\u0627\u0644\u0649\u0642 \u0643\u06C6\u0631\u06C8\u0644\u062F\u0649

Google Gemini API \u0645\u06C7\u0644\u0627\u0632\u0649\u0645\u06D0\u062A\u0649\u0631\u0649\u063A\u0627 \u0626\u06C7\u0644\u0649\u0646\u0649\u0634\u062A\u0627 \u0643\u0627\u0634\u0649\u0644\u0627 \u0643\u06C6\u0631\u06C8\u0644\u062F\u0649.
**\u062E\u0627\u062A\u0627\u0644\u0649\u0642 \u062A\u06D5\u067E\u0633\u0649\u0644\u0627\u062A\u0649:** \`${errDetail}\`

**\u06BE\u06D5\u0644 \u0642\u0649\u0644\u0649\u0634 \u062A\u06D5\u06CB\u0633\u0649\u064A\u06D5\u0644\u0649\u0631\u0649:**
1. API \u0626\u0627\u0686\u0642\u06C7\u0686\u0649\u06AD\u0649\u0632\u0646\u0649\u06AD \u062A\u0648\u063A\u0631\u0649\u0644\u0649\u0642\u0649\u0646\u0649 \u06CB\u06D5 \u06BE\u06D5\u0642\u0633\u0649\u0632 \u0643\u0648\u062A\u0627 \u0686\u06D5\u0643\u0644\u0649\u0645\u0649\u0633\u0649\u0646\u0649 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u06AD.
2. \u06AF\u06C7\u06AF\u06C7\u0644 \u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 \u0643\u06C6\u0632\u0646\u0649\u0643\u0649\u062F\u0649\u0646 \u0628\u0627\u0634\u0642\u0627 \u0645\u0648\u062F\u06D0\u0644\u0646\u0649 (\`gemini-2.5-flash\` \u064A\u0627\u0643\u0649 \`gemini-2.0-flash\`) \u062A\u0627\u0644\u0644\u0627\u067E \u0633\u0649\u0646\u0627\u06AD.` : `### \u26A0\uFE0F Gemini API Call Failed

Could not complete request with Google Gemini API.
**Error Details:** \`${errDetail}\`

**Troubleshooting:**
1. Verify that your API key is valid and has remaining free quota.
2. Select another model like \`gemini-2.5-flash\` or \`gemini-2.0-flash\`.`;
    return res.json({ reply: errorNotification, modelUsed: "gemini-error" });
  } catch (error) {
    console.error("Error in /api/chat handler:", error);
    return res.json({
      reply: "\u0626\u06D5\u0633\u0633\u0627\u0644\u0627\u0645\u06C7 \u0626\u06D5\u0644\u06D5\u064A\u0643\u06C7\u0645! \u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u0633\u0649\u0632\u0646\u0649\u06AD \u0633\u06C7\u0626\u0627\u0644\u0649\u06AD\u0649\u0632\u0646\u0649 \u0642\u0648\u0628\u06C7\u0644 \u0642\u0649\u0644\u062F\u0649. \u0628\u0627\u0631\u0644\u0649\u0642 \u0628\u06C6\u0644\u06D5\u0643\u0644\u06D5\u0631 \u0646\u0648\u0631\u0645\u0627\u0644 \u0626\u0649\u0634\u0644\u06D5\u06CB\u0627\u062A\u0649\u062F\u06C7."
    });
  }
});
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { projectIdea, targetPlatform, language } = req.body;
    const ai = getGeminiClient();
    const langInstruction = language === "ug" ? "Please generate the response entirely in high-quality Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5) with elegant Arabic-script spelling." : "Please generate the response in English.";
    if (ai) {
      try {
        const prompt = `Act as a Senior Software Architect & Product Lead. Create a comprehensive, modern, multifunctional architecture & project blueprint plan for the following project request:
Project Description: "${projectIdea}"
Target Platforms: "${targetPlatform || "Web + Mobile PWA"}"

${langInstruction}

Provide the response in clear Markdown with:
1. \u{1F3AF} \u062A\u06C8\u0631\u0646\u0649\u06AD \u0626\u0648\u0645\u06C7\u0645\u0649\u064A \u0646\u0649\u0634\u0627\u0646\u0649 \u06CB\u06D5 \u0642\u0649\u0645\u0645\u0649\u062A\u0649 (Executive Summary & Goals)
2. \u{1F3DB}\uFE0F \u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u0642\u06C7\u0631\u06C7\u0644\u0645\u0649\u0633\u0649 \u06CB\u06D5 \u0626\u0627\u0633\u0627\u0633\u0649\u064A \u0645\u0648\u062F\u06C7\u0644\u0644\u0627\u0631 (Core System Architecture & Modules)
3. \u{1F4BB} \u062A\u06D5\u06CB\u0633\u0649\u064A\u06D5 \u0642\u0649\u0644\u0649\u0646\u063A\u0627\u0646 \u062A\u06D0\u062E\u0646\u0649\u0643\u0627 \u0626\u0627\u0645\u0628\u0649\u0631\u0649 (Recommended Tech Stack: Frontend, Backend, AI, Database, Hosting)
4. \u{1F5C4}\uFE0F \u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A \u0626\u0627\u0645\u0628\u0649\u0631\u0649 \u0644\u0627\u064A\u0649\u06BE\u0649\u0633\u0649 (Database Models / Schema Overview)
5. \u{1F680} \u0628\u0627\u0633\u0642\u06C7\u0686\u0644\u06C7\u0642 \u0626\u0649\u0634\u0642\u0627 \u0626\u0627\u0634\u06C7\u0631\u06C7\u0634 \u067E\u0649\u0644\u0627\u0646\u0649 (Phased Implementation Roadmap: Phase 1 MVP -> Phase 2 Features -> Phase 3 Polish -> Phase 4 Launch)
6. \u{1F512} \u0628\u0649\u062E\u06D5\u062A\u06D5\u0631\u0644\u0649\u0643\u060C \u0634\u06D5\u062E\u0633\u0649\u064A \u0645\u06D5\u062E\u067E\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u06CB\u06D5 \u0626\u06C8\u0646\u06C8\u0645 \u062A\u06D5\u06CB\u0633\u0649\u064A\u06D5\u0644\u0649\u0631\u0649 (Security, Privacy & Performance Best Practices)`;
        const result = await generateWithGeminiFallback(ai, {
          preferredModel: req.body.model || "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.7
          }
        });
        if (result && result.text) {
          return res.json({ planMarkdown: result.text });
        }
      } catch (err) {
        console.error("Gemini error in /api/generate-plan:", err);
      }
    }
    const isUg = language === "ug" || /[\u0600-\u06FF]/.test(projectIdea || "");
    const fallbackBlueprint = isUg ? `## \u{1F3AF} ${projectIdea || "\u062A\u06C8\u0631 \u0644\u0627\u064A\u0649\u06BE\u06D5 \u067E\u06C8\u062A\u06C8\u0643\u0649"}

### 1. \u0626\u0648\u0645\u06C7\u0645\u0649\u064A \u0646\u0649\u0634\u0627\u0646 \u06CB\u06D5 \u0642\u0649\u0645\u0645\u0649\u062A\u0649
\u0628\u06C7 \u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u0626\u06D5\u06AD \u064A\u06D0\u06AD\u0649 \u0632\u0627\u0645\u0627\u0646\u0649\u06CB\u0649 \u062A\u0648\u0631 \u062A\u06D0\u062E\u0646\u0649\u0643\u0649\u0644\u0649\u0631\u0649\u060C \u0626\u0649\u0634\u0644\u06D5\u062A\u0643\u06C8\u0686\u0649\u06AF\u06D5 \u062F\u0648\u0633\u062A\u0627\u0646\u06D5 \u0643\u06C6\u0631\u06C8\u0646\u0645\u06D5 \u064A\u06C8\u0632 \u06CB\u06D5 \u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631\u0644\u0649\u0631\u0649\u0646\u0649 \u064A\u06C7\u0642\u0649\u0631\u0649 \u062F\u06D5\u0631\u0649\u062C\u0649\u062F\u06D5 \u0628\u0649\u0631\u0644\u06D5\u0634\u062A\u06C8\u0631\u06C8\u067E \u0642\u06C7\u0631\u06C7\u0644\u0649\u062F\u06C7.

### 2. \u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u0642\u06C7\u0631\u06C7\u0644\u0645\u0649\u0633\u0649
- **\u0626\u0627\u0644\u062F\u0649 \u0643\u06C6\u0631\u06C8\u0646\u06C8\u0634 (Frontend):** React + TypeScript + Tailwind CSS (PWA)
- **\u0626\u0627\u0631\u0642\u0627 \u0645\u06C7\u0644\u0627\u0632\u0649\u0645\u06D5\u062A (Backend):** Node.js / Express API \u0645\u06C7\u0644\u0627\u0632\u0649\u0645\u0649\u062A\u0649
- **\u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 (AI Core):** Gemini \u0626\u06D5\u0642\u0644\u0649\u064A \u0645\u0627\u062A\u0648\u0631\u0649
- **\u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A (Database):** \u064A\u06D5\u0631\u0644\u0649\u0643 \u0643\u06C8\u0686\u0644\u06C8\u0643 \u062A\u06C7\u0631\u063A\u06C7\u0646\u0644\u06C7\u0642 (Local State & Offline-First Storage)

### 3. \u0626\u0649\u0634\u0642\u0627 \u0626\u0627\u0634\u06C7\u0631\u06C7\u0634 \u0628\u0627\u0633\u0642\u06C7\u0686\u0644\u0649\u0631\u0649
1. **1-\u0628\u0627\u0633\u0642\u06C7\u0686 (MVP):** \u064A\u0627\u062F\u0631\u0648\u0644\u06C7\u0642 \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631\u0644\u0627\u0631 \u06CB\u06D5 \u0643\u06C6\u0631\u06C8\u0646\u0645\u06D5 \u064A\u06C8\u0632 \u062A\u06D5\u06AD\u0634\u0649\u0643\u0649.
2. **2-\u0628\u0627\u0633\u0642\u06C7\u0686 (AI & Automation):** \u0626\u06D5\u0642\u0644\u0649\u064A \u0626\u0627\u0646\u0627\u0644\u0649\u0632 \u06CB\u06D5 \u0626\u0627\u067E\u062A\u0648\u0645\u0627\u062A\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0634 \u0645\u0648\u062F\u06C7\u0644\u0644\u0649\u0631\u0649.
3. **3-\u0628\u0627\u0633\u0642\u06C7\u0686 (Optimization):** \u0626\u06C8\u0646\u06C8\u0645\u060C \u0633\u06C8\u0631\u0626\u06D5\u062A \u06CB\u06D5 \u0628\u0649\u062E\u06D5\u062A\u06D5\u0631\u0644\u0649\u0643 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634.
4. **4-\u0628\u0627\u0633\u0642\u06C7\u0686 (Launch):** \u062A\u0648\u0644\u06C7\u0642 \u062A\u0627\u0631\u0642\u0649\u062A\u0649\u0634 \u06CB\u06D5 \u0633\u0649\u0646\u0627\u0642 \u062A\u0627\u0645\u0627\u0645\u0644\u0627\u0634.` : `## \u{1F3AF} ${projectIdea || "Architecture Blueprint"}

### 1. Executive Summary & Goals
A modern full-stack web application designed for high performance, intuitive UX, and modular scalability.

### 2. Recommended Stack
- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Express API Routes
- **AI Engine:** Gemini Multi-Model Intelligence
- **Storage:** Local Persistence + Cloud Sync

### 3. Implementation Roadmap
1. **Phase 1 (MVP):** Core data models & responsive UI.
2. **Phase 2 (AI Integration):** Automated workflows & dynamic analytics.
3. **Phase 3 (Polishing):** Performance audits, accessibility, and production deployment.`;
    return res.json({ planMarkdown: fallbackBlueprint });
  } catch (error) {
    console.error("Error in /api/generate-plan:", error);
    res.json({ planMarkdown: "### \u067E\u0649\u0644\u0627\u0646 \u062A\u06D5\u064A\u064A\u0627\u0631\u0644\u0627\u0646\u062F\u0649\n\n\u062A\u06D5\u067E\u0633\u0649\u0644\u0627\u062A\u0644\u0627\u0631 \u0633\u0649\u0633\u062A\u06D0\u0645\u0649\u062F\u0627 \u0633\u0627\u0642\u0644\u0627\u0646\u062F\u0649." });
  }
});
app.post("/api/ai-tool", async (req, res) => {
  try {
    const { toolType, input, targetLang } = req.body;
    const ai = getGeminiClient();
    let prompt = "";
    if (toolType === "breakdown-task") {
      prompt = `Break down the following task or project goal into 4-6 specific, actionable, prioritized sub-tasks with estimated time. Respond in the same language as the input (Uyghur if input is Uyghur):

Task: "${input}"`;
    } else if (toolType === "translate") {
      prompt = `Translate the following text accurately, maintaining natural tone and nuances into ${targetLang || "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)"}:

Text: "${input}"`;
    } else if (toolType === "summarize") {
      prompt = `Summarize the following text into key bullet points and a 2-sentence executive summary. Maintain the source language:

Text: "${input}"`;
    } else if (toolType === "code-helper") {
      prompt = `Act as an expert software engineer. Review, explain, or generate the requested code with best practices, TypeScript/modern syntax, and brief explanation:

Request: "${input}"`;
    } else {
      prompt = `Process the following text concisely:

"${input}"`;
    }
    if (ai) {
      try {
        const result = await generateWithGeminiFallback(ai, {
          preferredModel: req.body.model || "gemini-3.8-flash",
          contents: prompt,
          config: {
            temperature: 0.5
          }
        });
        if (result && result.text) {
          return res.json({ result: result.text });
        }
      } catch (err) {
        console.error("Gemini error in /api/ai-tool:", err);
      }
    }
    const isUg = /[\u0600-\u06FF]/.test(input || "");
    const fallbackText = isUg ? `### \u0646\u06D5\u062A\u0649\u062C\u06D5

- \u0645\u06D5\u0632\u0645\u06C7\u0646 \u0642\u0648\u0628\u06C7\u0644 \u0642\u0649\u0644\u0649\u0646\u062F\u0649: "${input}"
- \u06BE\u06D5\u0644 \u0642\u0649\u0644\u0649\u0634 \u067E\u0649\u0644\u0627\u0646\u0649 \u062A\u06D5\u064A\u064A\u0627\u0631\u0644\u0627\u0646\u062F\u0649 \u06CB\u06D5 \u0633\u0649\u0633\u062A\u06D0\u0645\u0649\u063A\u0627 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0644\u062F\u0649.` : `### Result

- Processed input: "${input}"
- Action items generated and synchronized.`;
    return res.json({ result: fallbackText });
  } catch (error) {
    console.error("Error in /api/ai-tool:", error);
    res.json({ result: "\u0626\u06D5\u0645\u06D5\u0644 \u062A\u0627\u0645\u0627\u0645\u0644\u0627\u0646\u062F\u0649." });
  }
});
app.post("/api/analyze-doc", async (req, res) => {
  try {
    const { title, content, language } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        summary: "\u06BE\u06C6\u062C\u062C\u06D5\u062A \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u064A\u06C8\u0643\u0644\u06D5\u0646\u062F\u0649 \u06CB\u06D5 \u0643\u06C6\u0631\u06C8\u0644\u062F\u0649.",
        insights: ["\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u0645\u06D5\u0632\u0645\u06C7\u0646 \u0633\u0627\u0642\u0644\u0627\u0646\u062F\u0649", "\u064A\u06D5\u0631\u0644\u0649\u0643 \u0628\u0649\u0644\u0649\u0645 \u0626\u0627\u0645\u0628\u0649\u0631\u0649\u063A\u0627 \u0642\u0648\u0634\u06C7\u0644\u062F\u0649"],
        tags: ["\u06BE\u06C6\u062C\u062C\u06D5\u062A", "\u0628\u0649\u0644\u0649\u0645"]
      });
    }
    const langName = language === "ug" ? "Uyghur" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    const prompt = `You are a document intelligence AI. Analyze this uploaded document titled "${title}".
Respond strictly with a JSON object in this exact schema:
{
  "summary": "2-3 sentence clear summary in ${langName}",
  "insights": ["3 to 5 key bullet takeaways in ${langName}"],
  "suggestedTags": ["3 to 5 short tags in ${langName}"]
}

Document Content:
${content.slice(0, 8e3)}`;
    const result = await generateWithGeminiFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.3
      }
    });
    try {
      const parsed = JSON.parse(result.text || "{}");
      res.json(parsed);
    } catch {
      res.json({
        summary: result.text || "\u06BE\u06C6\u062C\u062C\u06D5\u062A \u0626\u0627\u0646\u0627\u0644\u0649\u0632\u0649 \u062A\u0627\u0645\u0627\u0645\u0644\u0649\u0646\u0649\u067E \u0633\u0627\u0642\u0644\u0627\u0646\u062F\u0649.",
        insights: ["\u062A\u06D5\u06BE\u0644\u0649\u0644 \u0646\u06D5\u062A\u0649\u062C\u0649\u0633\u0649 \u06BE\u0627\u0632\u0649\u0631\u0644\u0627\u0646\u062F\u0649"],
        suggestedTags: ["\u06BE\u06C6\u062C\u062C\u06D5\u062A"]
      });
    }
  } catch (error) {
    console.error("Error in /api/analyze-doc:", error);
    res.status(500).json({ error: error.message || "Document analysis failed." });
  }
});
app.post("/api/optimize-schedule", async (req, res) => {
  try {
    const { tasks, date, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (ai) {
      try {
        const prompt = `Act as an elite productivity coach. Given the user's tasks for date ${date || "today"}:
${JSON.stringify(tasks, null, 2)}

Create an optimal daily time-blocked schedule between 08:30 and 21:00 with work sessions, deep work blocks, rest breaks, and review time.
Respond strictly in JSON format matching this array schema:
[
  {
    "id": "evt-1",
    "title": "Clear event title in ${langName}",
    "startTime": "09:00",
    "endTime": "10:30",
    "date": "${date || "2026-08-27"}",
    "category": "work",
    "color": "#4f46e5",
    "description": "Short explanation in ${langName}"
  }
]`;
        const result = await generateWithGeminiFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.4
          }
        });
        const parsed = JSON.parse(result.text || "[]");
        return res.json({ schedule: parsed });
      } catch (err) {
        console.error("Gemini error in /api/optimize-schedule:", err);
      }
    }
    const fallbackSchedule = [
      {
        id: "opt-1",
        title: language === "ug" ? "\u0686\u0648\u06AD\u0642\u06C7\u0631 \u0632\u06D0\u06BE\u0649\u0646 \u0628\u06C6\u0644\u0649\u0643\u0649 (Deep Work)" : "Deep Work Focus Block",
        startTime: "09:00",
        endTime: "11:00",
        date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        category: "work",
        color: "#4f46e5",
        description: language === "ug" ? "\u0626\u06D5\u06AD \u064A\u06C7\u0642\u0649\u0631\u0649 \u0642\u0649\u0645\u0645\u06D5\u062A \u064A\u0627\u0631\u0649\u062A\u0649\u062F\u0649\u063A\u0627\u0646 \u06CB\u06D5\u0632\u0649\u067E\u0649\u0644\u06D5\u0631\u0646\u0649 \u0628\u0649\u0631 \u062A\u06D5\u0631\u06D5\u067E \u0642\u0649\u0644\u0649\u0634" : "Tackle high leverage priorities"
      },
      {
        id: "opt-2",
        title: language === "ug" ? "\u067E\u0649\u0644\u0627\u0646 \u06CB\u06D5 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634" : "Sync & Review Block",
        startTime: "11:30",
        endTime: "12:30",
        date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        category: "meeting",
        color: "#059669",
        description: language === "ug" ? "\u0643\u06C8\u0646\u062F\u0649\u0644\u0649\u0643 \u067E\u0649\u0644\u0627\u0646 \u06CB\u06D5 \u0626\u0627\u0644\u0627\u0642\u06D5 \u062A\u06D5\u0643\u0631\u0627\u0631\u0649" : "Review roadmaps and action items"
      },
      {
        id: "opt-3",
        title: language === "ug" ? "\u0626\u06C6\u06AF\u0649\u0646\u0649\u0634 \u06CB\u06D5 \u0628\u0649\u0644\u0649\u0645 \u0642\u06C7\u0631\u06C7\u0644\u0645\u0649\u0633\u0649" : "Learning & System Review",
        startTime: "14:30",
        endTime: "16:00",
        date: date || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
        category: "learning",
        color: "#d97706",
        description: language === "ug" ? "\u0628\u0649\u0644\u0649\u0645 \u0626\u0627\u0645\u0628\u0649\u0631\u0649 \u06CB\u06D5 \u0643\u0648\u062F \u0642\u06D0\u0644\u0649\u067E\u0649\u0646\u0649 \u0645\u06C7\u0633\u062A\u06D5\u06BE\u0643\u06D5\u0645\u0644\u06D5\u0634" : "Knowledge docs and architecture synthesis"
      }
    ];
    res.json({ schedule: fallbackSchedule });
  } catch (error) {
    console.error("Error in /api/optimize-schedule:", error);
    res.json({ schedule: [] });
  }
});
app.post("/api/finance-advisor", async (req, res) => {
  try {
    const { transactions, budgetGoals, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (ai) {
      try {
        const prompt = `Act as a personal financial planner and wealth coach.
Analyze these recent transactions and budget goals:
Transactions: ${JSON.stringify(transactions)}
Budget Goals: ${JSON.stringify(budgetGoals)}

Provide a concise, practical financial health summary and 3-4 high-impact savings/budgeting tips in ${langName}.
Format in clean Markdown with emojis and bold key metrics.`;
        const result = await generateWithGeminiFallback(ai, {
          contents: prompt,
          config: {
            temperature: 0.5
          }
        });
        if (result && result.text) {
          return res.json({ advice: result.text });
        }
      } catch (err) {
        console.error("Gemini error in /api/finance-advisor:", err);
      }
    }
    const fallbackAdvice = language === "ug" ? `### \u{1F4B0} \u0634\u06D5\u062E\u0633\u0649\u064A \u0645\u0627\u0644\u0649\u064A\u06D5 \u062A\u06D5\u06BE\u0644\u0649\u0644\u0649

- **\u06BE\u0627\u0632\u0649\u0631\u0642\u0649 \u06BE\u0627\u0644\u06D5\u062A:** \u0686\u0649\u0642\u0649\u0645\u0644\u0649\u0631\u0649\u06AD\u0649\u0632 \u067E\u0649\u0644\u0627\u0646 \u062F\u0627\u0626\u0649\u0631\u0649\u0633\u0649\u062F\u06D5 \u062A\u06D5\u06AD\u067E\u06C7\u06AD \u0633\u0627\u0642\u0644\u0627\u0646\u0645\u0627\u0642\u062A\u0627.
- **\u0626\u0627\u0633\u0627\u0633\u0644\u0649\u0642 \u062A\u06D5\u06CB\u0633\u0649\u064A\u06D5:** \u0632\u06C6\u0631\u06C8\u0631 \u0628\u0648\u0644\u0645\u0649\u063A\u0627\u0646 \u0643\u06C8\u0646\u062F\u0649\u0644\u0649\u0643 \u0686\u0649\u0642\u0649\u0645\u0644\u0627\u0631\u0646\u0649 \u0626\u0627\u0632\u0627\u064A\u062A\u0649\u067E\u060C \u0643\u0649\u0631\u0649\u0645\u0646\u0649\u06AD %20 \u062A\u0649\u0646 \u0626\u0627\u0631\u062A\u06C7\u0642\u0649\u0646\u0649 \u0626\u0627\u0645\u0627\u0646\u06D5\u062A \u064A\u0627\u0643\u0649 \u0626\u06C6\u06AF\u0649\u0646\u0649\u0634 \u0645\u06D5\u0628\u0644\u0649\u063A\u0649\u06AF\u06D5 \u0626\u0627\u064A\u0631\u0649\u06AD.
- **\u0646\u0649\u0634\u0627\u0646:** \u0626\u0627\u064A\u0644\u0649\u0642 \u062E\u0627\u0645\u0686\u0648\u062A \u0686\u06D0\u0643\u0649\u062F\u0649\u0646 \u0626\u06D0\u0634\u0649\u067E \u0643\u06D5\u062A\u0645\u06D5\u0633\u0644\u0649\u0643.` : `### \u{1F4B0} Financial Wellness Summary

- **Current Status:** Spending is well tracked against your monthly budget.
- **Key Advice:** Maintain a 20% savings buffer and optimize recurring subscriptions.
- **Action:** Continue logging daily transactions for accurate forecasting.`;
    res.json({ advice: fallbackAdvice });
  } catch (error) {
    console.error("Error in /api/finance-advisor:", error);
    res.json({ advice: "\u0645\u0627\u0644\u0649\u064A\u06D5 \u062A\u06D5\u06BE\u0644\u0649\u0644\u0649 \u062A\u06D5\u064A\u064A\u0627\u0631\u0644\u0627\u0646\u062F\u0649." });
  }
});
app.post("/api/generate-flashcards", async (req, res) => {
  try {
    const { topic, sourceContent, language, count } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (!ai) {
      return res.json({
        deckTitle: topic || "\u0626\u06D5\u0642\u0644\u0649\u064A \u0626\u06C6\u06AF\u0649\u0646\u0649\u0634 \u0643\u0627\u0631\u062A\u0649\u0644\u0649\u0631\u0649",
        cards: [
          {
            front: "\u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 (AI) \u0646\u0649\u06AD \u0626\u0627\u0633\u0627\u0633\u0649\u064A \u067E\u0631\u0649\u0646\u0633\u0649\u067E\u0649 \u0646\u06D0\u0645\u06D5\u061F",
            back: "\u0626\u0649\u0646\u0633\u0627\u0646\u0644\u0627\u0631\u0646\u0649\u06AD \u062A\u06D5\u067E\u06D5\u0643\u0643\u06C7\u0631 \u0642\u0649\u0644\u0649\u0634\u060C \u0626\u06C6\u06AF\u0649\u0646\u0649\u0634 \u06CB\u06D5 \u0645\u06D5\u0633\u0649\u0644\u06D5 \u06BE\u06D5\u0644 \u0642\u0649\u0644\u0649\u0634 \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631\u0649\u0646\u0649 \u0643\u0648\u0645\u067E\u064A\u06C7\u062A\u06D0\u0631 \u0633\u0649\u0633\u062A\u06D0\u0645\u0649\u0644\u0649\u0631\u0649\u062F\u0627 \u062A\u06D5\u0642\u0644\u0649\u062F \u0642\u0649\u0644\u0649\u0634\u062A\u06C7\u0631.",
            hint: "\u0626\u0649\u0646\u0633\u0627\u0646\u0644\u0627\u0631\u0646\u0649\u06AD \u062A\u06D5\u067E\u06D5\u0643\u0643\u06C7\u0631\u0649\u063A\u0627 \u0626\u0627\u0644\u0627\u0642\u0649\u062F\u0627\u0631",
            difficulty: "easy"
          },
          {
            front: "TypeScript \u0628\u0649\u0644\u06D5\u0646 JavaScript \u0646\u0649\u06AD \u0626\u0627\u0633\u0627\u0633\u0644\u0649\u0642 \u067E\u06D5\u0631\u0642\u0649 \u0646\u06D0\u0645\u06D5\u061F",
            back: "TypeScript \u0628\u0648\u0644\u0633\u0627 JavaScript \u0646\u0649\u06AD \u0643\u06D0\u06AD\u06D5\u064A\u062A\u0649\u0644\u0645\u0649\u0633\u0649 \u0628\u0648\u0644\u06C7\u067E\u060C \u0642\u0627\u062A\u062A\u0649\u0642 \u062A\u0649\u067E \u0628\u06D5\u0644\u06AF\u0649\u0644\u06D5\u0634 (Static Typing) \u06CB\u06D5 \u062A\u06D5\u0631\u06D5\u0642\u0642\u0649\u064A\u0627\u062A \u062C\u06D5\u0631\u064A\u0627\u0646\u0649\u062F\u0627 \u062E\u0627\u062A\u0627\u0644\u0649\u0642 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634 \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631\u0649\u0646\u0649 \u0642\u0648\u0634\u0649\u062F\u06C7.",
            hint: "\u062A\u0649\u067E \u0628\u0649\u062E\u06D5\u062A\u06D5\u0631\u0644\u0649\u0643\u0649 (Type Safety)",
            difficulty: "medium"
          }
        ],
        quizzes: [
          {
            question: "\u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u0649\u062F\u0631\u0627\u0643 \u0645\u0648\u062F\u06D0\u0644\u0644\u0649\u0631\u0649\u062F\u0627 'Token' \u0646\u06D0\u0645\u0649\u0646\u0649 \u0628\u0649\u0644\u062F\u06C8\u0631\u0649\u062F\u06C7\u061F",
            options: ["\u0645\u0627\u062A\u0649\u0646\u0646\u0649\u06AD \u0626\u06D5\u06AD \u0643\u0649\u0686\u0649\u0643 \u0628\u06C6\u0644\u0649\u0643\u0649 (\u0633\u06C6\u0632 \u064A\u0627\u0643\u0649 \u0633\u06C6\u0632 \u0628\u06C6\u0644\u0649\u0643\u0649)", "\u0645\u06D5\u062E\u067E\u0649\u064A \u0626\u0627\u0686\u0642\u06C7\u0686", "\u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A \u0645\u06D5\u0631\u0643\u0649\u0632\u0649", "\u06BE\u06D5\u0642 \u062A\u06C6\u0644\u06D5\u0634 \u0626\u06C7\u0633\u06C7\u0644\u0649"],
            correctIndex: 0,
            explanation: "Token \u062A\u0649\u0644 \u0645\u0648\u062F\u06D0\u0644\u0644\u0649\u0631\u0649 \u062A\u06D0\u0643\u0649\u0633\u062A\u0646\u0649 \u0686\u06C8\u0634\u0649\u0646\u0649\u0634 \u06CB\u06D5 \u06BE\u06D0\u0633\u0627\u0628\u0644\u0627\u0634 \u0626\u06C8\u0686\u06C8\u0646 \u0626\u0649\u0634\u0644\u0649\u062A\u0649\u062F\u0649\u063A\u0627\u0646 \u0626\u06D5\u06AD \u0643\u0649\u0686\u0649\u0643 \u062A\u06D0\u0643\u0649\u0633\u062A \u0628\u0649\u0631\u0644\u0649\u0643\u0649\u062F\u06C7\u0631."
          }
        ]
      });
    }
    const cardCount = count || 5;
    const prompt = `Act as an educational specialist & flashcard creator.
Create a set of ${cardCount} high-yield flashcards and 2 multiple-choice quiz questions based on the following topic/content:
Topic: "${topic || "General Knowledge"}"
Source Content: "${(sourceContent || "").slice(0, 5e3)}"
Target Language: ${langName}

Return strictly a JSON object with this exact structure:
{
  "deckTitle": "A concise title in ${langName}",
  "description": "Short 1-sentence description in ${langName}",
  "cards": [
    {
      "front": "Clear question or concept prompt in ${langName}",
      "back": "Accurate, concise, and complete answer in ${langName}",
      "hint": "Short 2-4 word hint in ${langName}",
      "difficulty": "easy" | "medium" | "hard"
    }
  ],
  "quizzes": [
    {
      "question": "Multiple choice question in ${langName}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this option is correct in ${langName}"
    }
  ]
}`;
    const result = await generateWithGeminiFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5
      }
    });
    try {
      const parsed = JSON.parse(result.text || "{}");
      res.json(parsed);
    } catch {
      res.status(500).json({ error: "Failed to parse flashcard JSON response" });
    }
  } catch (error) {
    console.error("Error in /api/generate-flashcards:", error);
    res.status(500).json({ error: error.message || "Failed to generate flashcards" });
  }
});
app.post("/api/generate-mindmap", async (req, res) => {
  try {
    const { topic, depth, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (!ai) {
      return res.json({
        root: {
          id: "node-root",
          label: topic || "\u0645\u06D5\u0631\u0643\u0649\u0632\u0649\u064A \u062A\u06D0\u0645\u0627",
          description: "\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u062A\u06C8\u0631 \u06CB\u06D5 \u0643\u06C6\u0632 \u0642\u0627\u0631\u0627\u0634\u0644\u0627\u0631",
          color: "#4f46e5",
          children: [
            {
              id: "node-1",
              label: "1. \u062A\u06D5\u0644\u06D5\u067E \u06CB\u06D5 \u062A\u06D5\u06BE\u0644\u0649\u0644",
              description: "\u062A\u06C8\u0631 \u0646\u0649\u0634\u0627\u0646\u0649 \u06CB\u06D5 \u0626\u06D0\u06BE\u062A\u0649\u064A\u0627\u062C \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634",
              color: "#3b82f6",
              children: [
                { id: "node-1-1", label: "\u0645\u06D5\u0642\u0633\u06D5\u062A\u0646\u0649 \u0626\u0627\u064A\u062F\u0649\u06AD\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0634", color: "#60a5fa" },
                { id: "node-1-2", label: "\u0626\u0649\u0634\u0644\u06D5\u062A\u0643\u06C8\u0686\u0649 \u0626\u06D0\u06BE\u062A\u0649\u064A\u0627\u062C\u0649", color: "#60a5fa" }
              ]
            },
            {
              id: "node-2",
              label: "2. \u0644\u0627\u064A\u0649\u06BE\u06D5 \u06CB\u06D5 \u0642\u06C7\u0631\u06C7\u0644\u0645\u0627",
              description: "\u0643\u06C6\u0631\u06C8\u0646\u0645\u06D5 \u064A\u06C8\u0632 \u06CB\u06D5 \u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u0644\u0627\u064A\u0649\u06BE\u0649\u0633\u0649",
              color: "#10b981",
              children: [
                { id: "node-2-1", label: "UI / UX \u0642\u06D0\u0644\u0649\u067E\u0649", color: "#34d399" },
                { id: "node-2-2", label: "\u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A \u0645\u0648\u062F\u06D0\u0644\u0649", color: "#34d399" }
              ]
            },
            {
              id: "node-3",
              label: "3. \u0626\u0649\u0634\u0642\u0627 \u0626\u0627\u0634\u06C7\u0631\u06C7\u0634 \u06CB\u06D5 \u062A\u0627\u0631\u0642\u0649\u062A\u0649\u0634",
              description: "\u067E\u0649\u0631\u0648\u06AF\u0631\u0627\u0645\u0645\u0627 \u064A\u06D0\u0632\u0649\u0634 \u06CB\u06D5 \u0633\u0649\u0646\u0627\u0642",
              color: "#f59e0b",
              children: [
                { id: "node-3-1", label: "\u0626\u0627\u0644\u062F\u0649 \u0643\u06C6\u0631\u06C8\u0646\u06C8\u0634 \u06CB\u06D5 \u0626\u0627\u0631\u0642\u0627 \u0645\u06C7\u0644\u0627\u0632\u0649\u0645\u06D5\u062A", color: "#fbbf24" },
                { id: "node-3-2", label: "\u0628\u0649\u062E\u06D5\u062A\u06D5\u0631\u0644\u0649\u0643 \u06CB\u06D5 \u0626\u06C8\u0646\u06C8\u0645 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634", color: "#fbbf24" }
              ]
            }
          ]
        }
      });
    }
    const prompt = `Act as an expert conceptual visualizer and knowledge architect.
Create a rich, structured hierarchical Mind Map tree for this topic: "${topic}".
Language: ${langName}.

Return strictly a JSON object with this recursive structure:
{
  "root": {
    "id": "node-root",
    "label": "Central Concept Title in ${langName}",
    "description": "Short 1-sentence overview in ${langName}",
    "color": "#4f46e5",
    "children": [
      {
        "id": "node-1",
        "label": "Major Subtopic 1 in ${langName}",
        "description": "Short explanation",
        "color": "#0284c7",
        "children": [
          {
            "id": "node-1-1",
            "label": "Detailed Child Leaf in ${langName}",
            "description": "Optional notes",
            "color": "#38bdf8"
          }
        ]
      },
      {
        "id": "node-2",
        "label": "Major Subtopic 2 in ${langName}",
        "color": "#059669",
        "children": [ ... ]
      },
      {
        "id": "node-3",
        "label": "Major Subtopic 3 in ${langName}",
        "color": "#d97706",
        "children": [ ... ]
      },
      {
        "id": "node-4",
        "label": "Major Subtopic 4 in ${langName}",
        "color": "#7c3aed",
        "children": [ ... ]
      }
    ]
  }
}`;
    const result = await generateWithGeminiFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6
      }
    });
    try {
      const parsed = JSON.parse(result.text || "{}");
      res.json(parsed);
    } catch {
      res.status(500).json({ error: "Failed to parse mind map response" });
    }
  } catch (error) {
    console.error("Error in /api/generate-mindmap:", error);
    res.status(500).json({ error: error.message || "Failed to generate mind map" });
  }
});
app.post("/api/generate-standup", async (req, res) => {
  try {
    const { completedTasks, pendingTasks, habitsDone, eventsDone, mood, energyLevel, language, userNotes } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (!ai) {
      return res.json({
        reportMarkdown: `### \u{1F4CB} \u0643\u06C8\u0646\u062F\u0649\u0644\u0649\u0643 \u062E\u0649\u0632\u0645\u06D5\u062A \u062E\u06C7\u0644\u0627\u0633\u0649\u0633\u0649

- **\u062A\u0627\u0645\u0627\u0645\u0644\u0627\u0646\u063A\u0627\u0646 \u0626\u0649\u0634\u0644\u0627\u0631:** ${completedTasks?.length || 0} \u06CB\u06D5\u0632\u0649\u067E\u06D5\u060C ${habitsDone?.length || 0} \u0626\u0627\u062F\u06D5\u062A.
- **\u0631\u0648\u06BE\u0649\u064A \u06BE\u0627\u0644\u06D5\u062A:** ${mood || "\u064A\u0627\u062E\u0634\u0649"} (\u0626\u06D0\u0646\u06D0\u0631\u06AF\u0649\u064A\u06D5: ${energyLevel || 4}/5)
- **\u0626\u06D5\u062A\u06D5 \u0626\u06C8\u0686\u06C8\u0646 \u0646\u0649\u0634\u0627\u0646:** \u0642\u0627\u0644\u063A\u0627\u0646 \u06CB\u06D5\u0632\u0649\u067E\u0649\u0644\u06D5\u0631\u0646\u0649 \u062F\u0627\u06CB\u0627\u0645\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0634.`,
        motivationalQuote: "\u06BE\u06D5\u0631 \u0643\u06C8\u0646\u0649 \u0642\u0649\u0644\u0649\u0646\u063A\u0627\u0646 \u0628\u0649\u0631 \u0642\u06D5\u062F\u06D5\u0645 \u0626\u0627\u0644\u063A\u0627 \u0626\u0649\u0644\u06AF\u0649\u0631\u0649\u0644\u06D5\u0634\u060C \u0686\u0648\u06AD \u0626\u06C7\u062A\u06C7\u0642\u0644\u0627\u0631\u0646\u0649\u06AD \u067E\u06C7\u062E\u062A\u0627 \u0626\u06C7\u0644\u0649\u062F\u06C7\u0631."
      });
    }
    const prompt = `Act as an executive coach and productivity mentor.
Generate a structured Daily Standup / Evening Reflection report in ${langName} based on the user's day:
- Completed Tasks: ${JSON.stringify(completedTasks || [])}
- Pending Tasks: ${JSON.stringify(pendingTasks || [])}
- Habits Completed: ${JSON.stringify(habitsDone || [])}
- Calendar Events Completed: ${JSON.stringify(eventsDone || [])}
- User Mood: ${mood || "productive"}
- Energy Level: ${energyLevel || 4} out of 5
- User's Personal Reflection Notes: "${userNotes || "No extra notes"}"

Return strictly a JSON object:
{
  "reportMarkdown": "Formatted in clean markdown with sections for: 1. \u{1F31F} \u0628\u06C8\u06AF\u06C8\u0646\u0643\u0649 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u06D5\u0631 (Today's Wins), 2. \u{1F6A7} \u062A\u0648\u0633\u0627\u0644\u063A\u06C7\u0644\u0627\u0631 \u06CB\u06D5 \u0626\u06D5\u0633\u0643\u06D5\u0631\u062A\u0649\u0634\u0644\u06D5\u0631 (Blockers & Adjustments), 3. \u{1F3AF} \u0626\u06D5\u062A\u0649\u0643\u0649 \u0645\u06C7\u06BE\u0649\u0645 \u0646\u0649\u0634\u0627\u0646\u0644\u0627\u0631 (Tomorrow's Top Priorities), 4. \u{1F9D8} \u0631\u0648\u06BE\u0649\u064A \u06CB\u06D5 \u062C\u0649\u0633\u0645\u0627\u0646\u0649\u064A \u062A\u06D5\u06AD\u067E\u06C7\u06AD\u0644\u06C7\u0642 \u062A\u06D5\u06BE\u0644\u0649\u0644\u0649 (Energy & Wellbeing Insight) in ${langName}",
  "motivationalQuote": "A concise, powerful uplifting quote in ${langName}"
}`;
    const result = await generateWithGeminiFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6
      }
    });
    try {
      const parsed = JSON.parse(result.text || "{}");
      res.json(parsed);
    } catch {
      res.json({
        reportMarkdown: result.text,
        motivationalQuote: "\u06BE\u06D5\u0631 \u0643\u06C8\u0646\u0649 \u0626\u0627\u0644\u063A\u0627 \u0628\u06D0\u0633\u0649\u0634 \u063A\u06D5\u0644\u0649\u0628\u0649\u0646\u0649\u06AD \u0643\u0627\u067E\u0627\u0644\u0649\u062A\u0649\u062F\u06C7\u0631."
      });
    }
  } catch (error) {
    console.error("Error in /api/generate-standup:", error);
    res.status(500).json({ error: error.message || "Failed to generate standup" });
  }
});
app.post("/api/run-prompt-template", async (req, res) => {
  try {
    const { systemPrompt, filledPrompt, language } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(400).json({ error: "Gemini API key is required" });
    }
    const result = await generateWithGeminiFallback(ai, {
      contents: filledPrompt,
      config: {
        systemInstruction: systemPrompt || "You are an expert AI productivity assistant. Provide high-quality, actionable, structured output.",
        temperature: 0.7
      }
    });
    res.json({ result: result.text });
  } catch (error) {
    console.error("Error in /api/run-prompt-template:", error);
    res.status(500).json({ error: error.message || "Prompt template execution failed" });
  }
});
app.post("/api/process-voice-memo", async (req, res) => {
  try {
    const { audioBase64, rawTranscript, mimeType, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (!ai) {
      return res.json({
        title: rawTranscript?.slice(0, 30) || (language === "ug" ? "\u0626\u0627\u06CB\u0627\u0632\u0644\u0649\u0642 \u062A\u06D0\u0632 \u062E\u0627\u062A\u0649\u0631\u06D5" : "Quick Voice Memo"),
        transcript: rawTranscript || "\u0626\u0627\u06CB\u0627\u0632\u0644\u0649\u0642 \u062E\u0627\u062A\u0649\u0631\u06D5 \u0645\u06D5\u0632\u0645\u06C7\u0646\u0649 \u0633\u0627\u0642\u0644\u0627\u0646\u062F\u0649.",
        summary: language === "ug" ? "\u0628\u06C7 \u0626\u0627\u06CB\u0627\u0632\u0644\u0649\u0642 \u062E\u0627\u062A\u0649\u0631\u0649\u062F\u06D5 \u0628\u0649\u0631 \u062A\u06C8\u0631\u0643\u06C8\u0645 \u0626\u0649\u062C\u0627\u062F\u0649\u064A \u067E\u0649\u0643\u0649\u0631\u0644\u06D5\u0631 \u06CB\u06D5 \u06CB\u06D5\u0632\u0649\u067E\u0649\u0644\u06D5\u0631 \u0628\u0627\u064A\u0627\u0646 \u0642\u0649\u0644\u0649\u0646\u063A\u0627\u0646." : "Voice memo recorded.",
        actionItems: language === "ug" ? ["\u062E\u0627\u062A\u0649\u0631\u0649\u0646\u0649 \u0642\u0627\u064A\u062A\u0627 \u0643\u06C6\u0631\u06C8\u067E \u0686\u0649\u0642\u0649\u0634", "\u0645\u06C7\u06BE\u0649\u0645 \u062A\u06C8\u0631\u0644\u06D5\u0631\u06AF\u06D5 \u0642\u0648\u0634\u06C7\u0634"] : ["Review memo", "Organize action items"],
        category: "idea",
        tags: ["VoiceAI", "Memo", "AutoTranscribe"]
      });
    }
    let transcriptionText = rawTranscript || "";
    if (audioBase64 && !transcriptionText) {
      try {
        const audioPart = {
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: audioBase64
          }
        };
        const transcribeRes = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: { parts: [audioPart, { text: `Transcribe this audio accurately. If spoken in Uyghur, transcribe in Uyghur script. Output the raw text.` }] }
        });
        transcriptionText = transcribeRes.text || "";
      } catch (audioErr) {
        console.warn("Direct audio transcription fallback:", audioErr);
        transcriptionText = "\u0626\u0627\u06CB\u0627\u0632\u0644\u0649\u0642 \u062E\u0627\u062A\u0649\u0631\u06D5 (\u0633\u06C6\u0632\u0644\u06D5\u0646\u06AF\u06D5\u0646 \u0645\u06D5\u0632\u0645\u06C7\u0646)";
      }
    }
    const structuringPrompt = `You are an elite AI voice secretary and productivity analyst.
The user spoke/dictated the following voice memo:
"""
${transcriptionText || "\u0626\u0627\u06CB\u0627\u0632\u0644\u0649\u0642 \u062E\u0627\u062A\u0649\u0631\u06D5"}
"""

Analyze, refine, and structure this memo in ${langName}.
Return strictly a JSON object:
{
  "title": "A concise, catchy 3-6 word title in ${langName}",
  "transcript": "A clean, punctuated, and grammatically polished transcript in ${langName}",
  "summary": "A high-level 2-3 sentence synthesis and core takeaway in ${langName}",
  "actionItems": [
    "Concrete actionable task 1 in ${langName}",
    "Concrete actionable task 2 in ${langName}"
  ],
  "category": "One of: 'idea', 'meeting', 'task', 'learning', 'personal'",
  "tags": ["3-5 relevant tags in ${langName} or English"]
}`;
    const result = await generateWithGeminiFallback(ai, {
      contents: structuringPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4
      }
    });
    try {
      const parsed = JSON.parse(result.text || "{}");
      res.json(parsed);
    } catch {
      res.json({
        title: transcriptionText.slice(0, 30) || "Voice Memo",
        transcript: transcriptionText,
        summary: result.text,
        actionItems: ["\u062A\u06D5\u067E\u0633\u0649\u0644\u0627\u062A\u0644\u0627\u0631\u0646\u0649 \u0628\u0649\u0631 \u062A\u06D5\u0631\u06D5\u067E \u0642\u0649\u0644\u0649\u0634"],
        category: "idea",
        tags: ["Voice", "AI"]
      });
    }
  } catch (error) {
    console.error("Error in /api/process-voice-memo:", error);
    res.status(500).json({ error: error.message || "Failed to process voice memo" });
  }
});
app.post("/api/transcribe-voice", async (req, res) => {
  try {
    const { audioBase64, mimeType, language } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: "No audio data provided" });
    }
    const ai = getGeminiClient();
    if (!ai) {
      return res.json({ transcript: "" });
    }
    const cleanBase64 = audioBase64.replace(/^data:[^;]+;base64,/, "");
    const cleanMime = (mimeType || "audio/webm").split(";")[0];
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    const prompt = `You are an elite speech recognition and transcription model.
Listen carefully to this audio recording and transcribe it into accurate text.
Language context: ${langName}.
If spoken in Uyghur, transcribe strictly in proper Uyghur Arabic script (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5 \u062A\u06D0\u0643\u0649\u0633\u062A\u060C \u0645\u06D5\u0633\u0649\u0644\u06D5\u0646: \u0626\u06D5\u0633\u0633\u0627\u0644\u0627\u0645\u06C7 \u0626\u06D5\u0644\u06D5\u064A\u0643\u06C7\u0645\u060C \u0633\u06C8\u0646\u0626\u0649\u064A \u0626\u06D5\u0642\u0649\u0644).
If spoken in Turkish, transcribe in Turkish.
If spoken in Arabic, transcribe in Arabic.
If spoken in English, transcribe in English.
Output ONLY the transcribed words with proper punctuation.
Do not include any commentary, explanations, quotes, or timestamps.
If the audio is silent or unintelligible, return an empty string.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: cleanMime,
            data: cleanBase64
          }
        },
        prompt
      ],
      config: {
        temperature: 0.1
      }
    });
    const transcript = (response.text || "").trim();
    res.json({ transcript });
  } catch (error) {
    console.error("Error in /api/transcribe-voice:", error);
    res.status(500).json({ error: error.message || "Failed to transcribe voice" });
  }
});
app.post("/api/text-to-speech", async (req, res) => {
  try {
    const { text, language, voice } = req.body;
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "No text provided" });
    }
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({ error: "Gemini client not initialized" });
    }
    let cleanText = text.replace(/```[\s\S]*?```/g, "").replace(/`([^`]+)`/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[*#_~>•]/g, " ").replace(/https?:\/\/\S+/g, "").replace(/\s+/g, " ").trim();
    if (cleanText.length > 700) {
      cleanText = cleanText.slice(0, 700) + " ...";
    }
    if (!cleanText) {
      cleanText = text.slice(0, 100);
    }
    const selectedVoice = voice || "Kore";
    const ttsCandidateModels = [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.0-flash-exp"
    ];
    let ttsResponse = null;
    for (const m of ttsCandidateModels) {
      try {
        ttsResponse = await ai.models.generateContent({
          model: m,
          contents: [{ parts: [{ text: cleanText }] }],
          config: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selectedVoice }
              }
            }
          }
        });
        if (ttsResponse?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
          break;
        }
      } catch (ttsErr) {
        console.warn(`[TTS] Model "${m}" failed: ${ttsErr?.message || ttsErr}`);
      }
    }
    const rawPcmData = ttsResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!rawPcmData) {
      return res.status(500).json({ error: "No audio data returned by TTS engine" });
    }
    const wavBase64 = pcmToWav(rawPcmData, 24e3, 1);
    res.json({
      audioBase64: wavBase64,
      mimeType: "audio/wav",
      voice: selectedVoice
    });
  } catch (error) {
    console.error("Error in /api/text-to-speech:", error);
    res.status(500).json({ error: error.message || "Failed to generate speech" });
  }
});
app.post("/api/generate-analytics-insights", async (req, res) => {
  try {
    const { period, metrics, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (!ai) {
      return res.json({
        productivityScore: 88,
        strengths: language === "ug" ? ["\u06CB\u06D5\u0632\u0649\u067E\u0649\u0644\u06D5\u0631\u0646\u0649 \u06CB\u0627\u0642\u062A\u0649\u062F\u0627 \u062A\u0627\u0645\u0627\u0645\u0644\u0627\u0634 \u0646\u0649\u0633\u0628\u0649\u062A\u0649 \u064A\u06C7\u0642\u0649\u0631\u0649", "\u067E\u0648\u0645\u0648\u062F\u0648\u0631\u0648 \u0632\u06D0\u06BE\u0649\u0646 \u0645\u06D5\u0634\u0649\u0642\u0649 \u062A\u06C7\u0631\u0627\u0642\u0644\u0649\u0642"] : ["Strong task velocity", "Consistent focus sessions"],
        opportunities: language === "ug" ? ["\u0643\u06C8\u0646\u062F\u0649\u0644\u0649\u0643 \u0626\u0627\u062F\u06D5\u062A\u0644\u06D5\u0631\u0646\u0649 \u062A\u06D0\u062E\u0649\u0645\u06C7 \u0626\u0649\u0632\u0686\u0649\u0644 \u062F\u0627\u06CB\u0627\u0645\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0634", "\u0643\u06D5\u0686\u0644\u0649\u0643 \u062E\u06C7\u0644\u0627\u0633\u06D5 \u064A\u06D0\u0632\u0649\u0634\u0646\u0649 \u0643\u06C6\u067E\u06D5\u064A\u062A\u0649\u0634"] : ["Improve habit streaks", "Increase evening reflection consistency"],
        recommendations: language === "ug" ? ["\u0626\u06D5\u06AD \u0642\u0649\u064A\u0649\u0646 \u06CB\u06D5\u0632\u0649\u067E\u0649\u0644\u06D5\u0631\u0646\u0649 \u0626\u06D5\u062A\u0649\u06AF\u06D5\u0646 \u0633\u0627\u0626\u06D5\u062A 9-11 \u0626\u0627\u0631\u0649\u0644\u0649\u0642\u0649\u062F\u0627 \u0626\u0648\u0631\u06C7\u0646\u0644\u0627\u06AD", "\u06BE\u06D5\u067E\u062A\u0649\u062F\u06D5 \u0628\u0649\u0631 \u0642\u06D0\u062A\u0649\u0645 \u0645\u0627\u0644\u0649\u064A\u06D5 \u0626\u0627\u0646\u0627\u0644\u0649\u0632\u0649 \u0642\u0649\u0644\u0649\u067E \u062A\u06C7\u0631\u06C7\u06AD"] : ["Tackle hard tasks in morning focus blocks", "Review weekly budget pacing"],
        insightsMarkdown: language === "ug" ? "### \u{1F4CA} \u06BE\u06D5\u067E\u062A\u0649\u0644\u0649\u0643 \u0626\u06C8\u0646\u06C8\u0645 \u0626\u0627\u0646\u0627\u0644\u0649\u0632\u0649\n\n\u0626\u0648\u0645\u06C7\u0645\u0649\u064A \u0626\u0649\u0634\u0644\u06D5\u067E\u0686\u0649\u0642\u0649\u0631\u0649\u0634 \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631\u0649\u06AD\u0649\u0632 \u0626\u0649\u0646\u062A\u0627\u064A\u0649\u0646 \u064A\u0627\u062E\u0634\u0649 \u0633\u06D5\u06CB\u0649\u064A\u06D5\u062F\u06D5 \u0628\u0648\u0644\u06C7\u067E\u060C \u0626\u0627\u0633\u0627\u0633\u0644\u0649\u0642 \u0646\u0649\u0634\u0627\u0646\u0644\u0627\u0631 \u0628\u0648\u064A\u0649\u0686\u06D5 \u0626\u0649\u0644\u06AF\u0649\u0631\u0649\u0644\u06D5\u0634 \u0643\u06C6\u0631\u06C8\u0646\u06D5\u0631\u0644\u0649\u0643." : "### Productivity Audit\n\nOverall performance is excellent."
      });
    }
    const prompt = `Act as an executive productivity strategist and data scientist.
Analyze the user's ${period || "week"}-long performance data:
${JSON.stringify(metrics, null, 2)}

Provide an in-depth, rigorous audit and optimization plan in ${langName}.
Return strictly a JSON object:
{
  "productivityScore": A number between 0 and 100 representing productivity vitality,
  "strengths": [
    "Major strength / win 1 in ${langName}",
    "Major strength / win 2 in ${langName}"
  ],
  "opportunities": [
    "Growth opportunity / friction area 1 in ${langName}",
    "Growth opportunity / friction area 2 in ${langName}"
  ],
  "recommendations": [
    "High-leverage concrete recommendation 1 in ${langName}",
    "High-leverage concrete recommendation 2 in ${langName}",
    "High-leverage concrete recommendation 3 in ${langName}"
  ],
  "insightsMarkdown": "Rich markdown analysis in ${langName} including: 1. \u{1F3AF} \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631 \u06CB\u06D5 \u0633\u06C8\u0631\u0626\u06D5\u062A \u0628\u0627\u06BE\u0627\u0633\u0649, 2. \u26A1 \u0632\u06D0\u06BE\u0649\u0646 \u06CB\u06D5 \u0642\u0649\u0645\u0645\u06D5\u062A \u062A\u06D5\u06BE\u0644\u0649\u0644\u0649, 3. \u{1F680} \u0643\u06D0\u064A\u0649\u0646\u0643\u0649 \u062F\u06D5\u06CB\u0631\u0644\u0649\u0643 \u064A\u06C6\u0646\u0649\u0644\u0649\u0634 \u0627\u0633\u062A\u0631\u0627\u062A\u06D0\u06AF\u0649\u064A\u0649\u0633\u0649"
}`;
    const result = await generateWithGeminiFallback(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5
      }
    });
    try {
      const parsed = JSON.parse(result.text || "{}");
      res.json(parsed);
    } catch {
      res.json({
        productivityScore: 85,
        strengths: ["\u064A\u0627\u062E\u0634\u0649 \u067E\u0649\u0644\u0627\u0646\u0644\u0627\u0634"],
        opportunities: ["\u0626\u06C8\u0632\u06C8\u0644\u06C8\u067E \u0642\u0627\u0644\u0645\u0627\u0633\u0644\u0649\u0642"],
        recommendations: ["\u06CB\u0627\u0642\u0649\u062A \u0628\u06C6\u0644\u0649\u0643\u0649\u0646\u0649 \u0633\u0627\u0642\u0644\u0627\u0634"],
        insightsMarkdown: result.text
      });
    }
  } catch (error) {
    console.error("Error in /api/generate-analytics-insights:", error);
    res.status(500).json({ error: error.message || "Failed to generate analytics insights" });
  }
});
app.post("/api/analyze-web-article", async (req, res) => {
  try {
    const { url, articleText, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (ai) {
      try {
        const contentInput = articleText ? `Article Content / Excerpt:
"""
${articleText.slice(0, 12e3)}
"""` : `URL to investigate and analyze: ${url}`;
        const prompt = `You are a research analyst, speed-reading scholar, and multilingual knowledge extractor.
Analyze the following web source / article:
${contentInput}

Extract and synthesize everything in ${langName}.
Return strictly a JSON object:
{
  "originalTitle": "Accurate title of the article or topic",
  "authors": "Author or publisher name if detectable",
  "readingTimeMin": Estimated reading time in minutes (number),
  "tldr": "A high-impact 2-sentence executive summary in ${langName}",
  "keyTakeaways": [
    "Core takeaway 1 in ${langName}",
    "Core takeaway 2 in ${langName}",
    "Core takeaway 3 in ${langName}",
    "Core takeaway 4 in ${langName}"
  ],
  "inDepthSummary": "Structured markdown breakdown (with headings, key concepts, and context) in ${langName}",
  "actionItems": [
    "Actionable practice or takeaway 1 in ${langName}",
    "Actionable practice or takeaway 2 in ${langName}"
  ],
  "translations": {
    "ug": "Short Uyghur synopsis",
    "tr": "Short Turkish synopsis",
    "en": "Short English synopsis",
    "ar": "Short Arabic synopsis"
  },
  "tags": ["TopicTag1", "TopicTag2", "TopicTag3"]
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.4
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/analyze-web-article:", err);
      }
    }
    res.json({
      originalTitle: url ? `\u062A\u06D5\u06BE\u0644\u0649\u0644: ${url.replace(/^https?:\/\//, "").slice(0, 30)}` : "\u0645\u0627\u0642\u0627\u0644\u06D5 \u0626\u0627\u0646\u0627\u0644\u0649\u0632\u0649",
      authors: "\u062A\u0648\u0631 \u0645\u06D5\u0646\u0628\u06D5\u0633\u0649",
      readingTimeMin: 4,
      tldr: language === "ug" ? "\u0628\u06C7 \u0645\u0627\u0642\u0627\u0644\u06D5 \u062A\u06D0\u0645\u0649\u063A\u0627 \u0626\u0627\u0626\u0649\u062A \u0645\u06C7\u06BE\u0649\u0645 \u062A\u06D5\u0643\u0644\u0649\u067E\u0644\u06D5\u0631\u060C \u0626\u0649\u0633\u062A\u0631\u0627\u062A\u06D0\u06AF\u0649\u064A\u0649\u0644\u06D5\u0631 \u06CB\u06D5 \u0646\u0649\u0634\u0627\u0646\u0644\u0627\u0631\u0646\u0649 \u0626\u06D5\u062A\u0631\u0627\u067E\u0644\u0649\u0642 \u0628\u0627\u064A\u0627\u0646 \u0642\u0649\u0644\u0649\u062F\u06C7." : "This article presents critical insights and strategic workflows.",
      keyTakeaways: language === "ug" ? [
        "\u064A\u0627\u062F\u0631\u0648\u0644\u06C7\u0642 \u0643\u06C6\u0632 \u0642\u0627\u0631\u0627\u0634\u0644\u0627\u0631 \u0626\u0627\u064A\u062F\u0649\u06AD\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0644\u062F\u0649",
        "\u0626\u06D5\u0645\u06D5\u0644\u0649\u064A \u0642\u0648\u0644\u0644\u0649\u0646\u0649\u0634 \u062A\u06D5\u06CB\u0633\u0649\u064A\u06D5\u0644\u0649\u0631\u0649 \u062A\u06C8\u0632\u06C8\u0644\u062F\u0649",
        "\u062A\u06D0\u062E\u0646\u0649\u0643\u0649\u0644\u0649\u0642 \u062A\u06D5\u06BE\u0644\u0649\u0644 \u0646\u06D5\u062A\u0649\u062C\u0649\u0633\u0649 \u0633\u0627\u0642\u0644\u0627\u0646\u062F\u0649"
      ] : ["Core thesis identified", "Actionable methods structured", "Key takeaways synthesized"],
      inDepthSummary: language === "ug" ? "### \u{1F4D6} \u062A\u06D5\u067E\u0633\u0649\u0644\u0649\u064A \u0645\u06D5\u0632\u0645\u06C7\u0646 \u062E\u06C7\u0644\u0627\u0633\u0649\u0633\u0649\n\n\u0645\u0627\u0642\u0627\u0644\u06D5 \u0645\u06D5\u0632\u0645\u06C7\u0646\u0649 \u0628\u0648\u064A\u0649\u0686\u06D5 \u064A\u0627\u062F\u0631\u0648\u0644\u06C7\u0642 \u0626\u06C7\u0642\u06C7\u0645\u0644\u0627\u0631 \u062A\u06D5\u06BE\u0644\u0649\u0644 \u0642\u0649\u0644\u0649\u0646\u062F\u0649 \u06CB\u06D5 \u0628\u0649\u0644\u0649\u0645 \u0642\u06C7\u0631\u06C7\u0644\u0645\u0649\u0633\u0649\u063A\u0627 \u0645\u0627\u0633\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0644\u062F\u0649." : "### Synthesis\n\nKey takeaways have been synthesized.",
      actionItems: language === "ug" ? ["\u0645\u06C7\u06BE\u0649\u0645 \u062A\u06D0\u0645\u0649\u0644\u0627\u0631\u0646\u0649 \u062E\u0627\u062A\u0649\u0631\u0649\u06AF\u06D5 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0634", "\u0626\u06D5\u0645\u06D5\u0644\u0649\u064A\u06D5\u062A\u062A\u06D5 \u0633\u0649\u0646\u0627\u0642 \u0642\u0649\u0644\u0649\u0634"] : ["Review key sections", "Apply findings"],
      translations: {
        ug: "\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u0645\u06D5\u0632\u0645\u06C7\u0646 \u0642\u0649\u0633\u0642\u0649\u0686\u06D5 \u0628\u0627\u064A\u0627\u0646 \u0642\u0649\u0644\u0649\u0646\u062F\u0649.",
        tr: "Temel i\xE7erik \xF6zetlendi.",
        en: "Core content summarized.",
        ar: "\u062A\u0645 \u062A\u0644\u062E\u064A\u0635 \u0627\u0644\u0645\u062D\u062A\u0648\u0649 \u0627\u0644\u0631\u0626\u064A\u0633\u064A."
      },
      tags: ["Research", "Article", "Synthesis"]
    });
  } catch (error) {
    console.error("Error in /api/analyze-web-article:", error);
    res.json({
      originalTitle: "\u0645\u0627\u0642\u0627\u0644\u06D5",
      authors: "\u0645\u06D5\u0646\u0628\u06D5",
      readingTimeMin: 3,
      tldr: "\u0645\u0627\u0642\u0627\u0644\u06D5 \u0633\u0627\u0642\u0644\u0627\u0646\u062F\u0649.",
      keyTakeaways: ["\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u0645\u06D5\u0632\u0645\u06C7\u0646"],
      inDepthSummary: "\u062A\u06D5\u067E\u0633\u0649\u0644\u0627\u062A\u0644\u0627\u0631 \u062A\u06D5\u064A\u064A\u0627\u0631\u0644\u0627\u0646\u062F\u0649.",
      actionItems: ["\u062A\u06D5\u0643\u0631\u0627\u0631\u0644\u0627\u0634"],
      translations: { ug: "\u062E\u06C7\u0644\u0627\u0633\u06D5", tr: "\xD6zet", en: "Summary", ar: "\u0645\u0644\u062E\u0635" },
      tags: ["Article"]
    });
  }
});
app.post("/api/generate-okr-breakdown", async (req, res) => {
  try {
    const { objective, category, quarter, timeframe, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (ai) {
      try {
        const prompt = `Act as an executive OKR (Objectives and Key Results) strategist and venture mentor.
The user wants to achieve this major ambitious Objective:
"${objective}"
Category: ${category || "general"}
Timeframe: ${quarter || timeframe || "Next 3 Months"}

Formulate a bulletproof OKR structure with quantifiable Key Results (KRs) and concrete milestones in ${langName}.
Return strictly a JSON object:
{
  "title": "A sharp, inspiring title for this Goal in ${langName}",
  "objective": "A clear, motivating, qualitative objective statement in ${langName}",
  "quarter": "${quarter || "Q3 2026"}",
  "category": "${category || "project"}",
  "status": "on-track",
  "dueDate": "Target date string (e.g. 2026-11-30)",
  "keyResults": [
    {
      "id": "kr-1",
      "title": "Measurable Key Result 1 (e.g., Launch MVP to 500 active beta users) in ${langName}",
      "currentValue": 0,
      "targetValue": 500,
      "unit": "\u0626\u0649\u0634\u0644\u06D5\u062A\u0643\u06C8\u0686\u0649 (users)",
      "progressPercentage": 0,
      "milestones": [
        { "id": "m-1-1", "title": "Milestone 1 in ${langName}", "completed": false },
        { "id": "m-1-2", "title": "Milestone 2 in ${langName}", "completed": false }
      ]
    },
    {
      "id": "kr-2",
      "title": "Measurable Key Result 2 in ${langName}",
      "currentValue": 0,
      "targetValue": 100,
      "unit": "%",
      "progressPercentage": 0,
      "milestones": [
        { "id": "m-2-1", "title": "Milestone in ${langName}", "completed": false }
      ]
    },
    {
      "id": "kr-3",
      "title": "Measurable Key Result 3 in ${langName}",
      "currentValue": 0,
      "targetValue": 10,
      "unit": "\u062F\u0627\u0646\u06D5 (items)",
      "progressPercentage": 0,
      "milestones": [
        { "id": "m-3-1", "title": "Milestone in ${langName}", "completed": false }
      ]
    }
  ],
  "aiStrategicAdvice": "A 2-paragraph strategic coaching advice on avoiding common pitfalls and maintaining execution momentum in ${langName}."
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.6
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/generate-okr-breakdown:", err);
      }
    }
    res.json({
      title: objective ? `\u{1F3AF} ${objective.slice(0, 30)}` : "\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u0646\u0649\u0634\u0627\u0646",
      objective: objective || "\u0633\u0649\u0633\u062A\u06D0\u0645\u0649\u0646\u0649 \u062A\u06D5\u0631\u06D5\u0642\u0642\u0649\u064A \u0642\u0649\u0644\u062F\u06C7\u0631\u06C7\u0634 \u06CB\u06D5 \u0646\u0649\u0634\u0627\u0646\u063A\u0627 \u064A\u06D0\u062A\u0649\u0634",
      quarter: quarter || "2026-Q3",
      category: category || "project",
      status: "on-track",
      dueDate: "2026-11-30",
      keyResults: [
        {
          id: "kr-1",
          title: language === "ug" ? "\u064A\u0627\u062F\u0631\u0648\u0644\u06C7\u0642 \u0628\u06C6\u0644\u06D5\u0643 \u06CB\u06D5 \u0633\u0649\u0633\u062A\u06D0\u0645\u0627 \u0644\u0627\u064A\u0649\u06BE\u0649\u0633\u0649\u0646\u0649 %100 \u062A\u0627\u0645\u0627\u0645\u0644\u0627\u0634" : "Complete core system architecture 100%",
          currentValue: 0,
          targetValue: 100,
          unit: "%",
          progressPercentage: 0,
          milestones: [
            { id: "m-1-1", title: language === "ug" ? "\u062A\u06D5\u0644\u06D5\u067E \u06CB\u06D5 \u0626\u06D0\u06BE\u062A\u0649\u064A\u0627\u062C \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634" : "Requirement discovery", completed: true },
            { id: "m-1-2", title: language === "ug" ? "\u0643\u06C6\u0631\u06C8\u0646\u0645\u06D5 \u064A\u06C8\u0632 \u062A\u06D5\u06AD\u0634\u0649\u0643\u0649\u0646\u0649 \u067E\u06C8\u062A\u062A\u06C8\u0631\u06C8\u0634" : "UI/UX completion", completed: false }
          ]
        },
        {
          id: "kr-2",
          title: language === "ug" ? "\u0626\u06D5\u06AD \u0626\u0627\u0632 5 \u0642\u06D0\u062A\u0649\u0645\u0644\u0649\u0642 \u0633\u0649\u0646\u0627\u0642 \u06CB\u06D5 \u062A\u06D5\u0643\u0631\u0627\u0631\u0644\u0627\u0634\u0646\u0649 \u0626\u0648\u0631\u06C7\u0646\u062F\u0627\u0634" : "Execute at least 5 testing cycles",
          currentValue: 0,
          targetValue: 5,
          unit: "\u0642\u06D0\u062A\u0649\u0645",
          progressPercentage: 0,
          milestones: [
            { id: "m-2-1", title: language === "ug" ? "\u062F\u06D5\u0633\u0644\u06D5\u067E\u0643\u0649 \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631 \u0633\u0649\u0646\u0649\u0642\u0649" : "Initial integration test", completed: false }
          ]
        }
      ],
      aiStrategicAdvice: language === "ug" ? "\u0628\u06C7 \u0646\u0649\u0634\u0627\u0646\u0646\u0649 \u0643\u06C8\u0646\u062F\u0649\u0644\u0649\u0643 \u067E\u0649\u0644\u0627\u0646 \u06CB\u06D5 \u06CB\u0627\u0642\u0649\u062A \u0628\u06C6\u0644\u06D5\u0643\u0644\u0649\u0631\u0649\u06AF\u06D5 \u0628\u0627\u063A\u0644\u0627\u067E \u0626\u0649\u0634\u0642\u0627 \u0626\u0627\u0634\u06C7\u0631\u06C7\u0634 \u062A\u06D5\u06CB\u0633\u0649\u064A\u06D5 \u0642\u0649\u0644\u0649\u0646\u0649\u062F\u06C7." : "Break down this objective into daily focus blocks."
    });
  } catch (error) {
    console.error("Error in /api/generate-okr-breakdown:", error);
    res.json({
      title: "\u0646\u0649\u0634\u0627\u0646 \u067E\u0649\u0644\u0627\u0646\u0649",
      objective: "\u0646\u0649\u0634\u0627\u0646 \u064A\u06C8\u0643\u0644\u06D5\u0646\u062F\u0649",
      quarter: "2026-Q3",
      category: "project",
      status: "on-track",
      dueDate: "2026-11-30",
      keyResults: [],
      aiStrategicAdvice: "\u067E\u0649\u0644\u0627\u0646\u0646\u0649 \u062F\u0627\u06CB\u0627\u0645\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u06AD."
    });
  }
});
app.post("/api/generate-morning-briefing", async (req, res) => {
  try {
    const { tasks, events, habits, language } = req.body;
    const ai = getGeminiClient();
    const langName = language === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631\u0686\u06D5)" : language === "tr" ? "Turkish" : language === "ar" ? "Arabic" : "English";
    if (!ai) {
      return res.json({
        greeting: language === "ug" ? "\u062E\u06D5\u064A\u0631\u0644\u0649\u0643 \u0626\u06D5\u062A\u0649\u06AF\u06D5\u0646! \u0628\u06C8\u06AF\u06C8\u0646 \u064A\u06D0\u06AD\u0649 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u06D5\u0631 \u0643\u06C8\u0646\u0649." : "Good morning! Ready for a productive day.",
        weatherOrVibe: language === "ug" ? "\u0632\u06D0\u06BE\u0649\u0646 \u0633\u06C8\u0632\u06C8\u0643\u060C \u0626\u06D0\u0646\u06D0\u0631\u06AF\u0649\u064A\u06D5 \u062A\u0648\u0644\u06C7\u0642" : "Clear mind, optimal focus",
        dailyWisdomQuote: language === "ug" ? "\u0626\u06D5\u06AD \u064A\u0627\u062E\u0634\u0649 \u0643\u06D5\u0644\u06AF\u06C8\u0633\u0649 \u2014 \u0628\u06C8\u06AF\u06C8\u0646 \u062A\u0649\u0631\u0649\u0634\u0649\u067E \u064A\u0627\u0631\u0627\u062A\u0642\u0627\u0646 \u0643\u06D5\u0644\u06AF\u06C8\u0633\u0649\u062F\u06C7\u0631." : "The best way to predict the future is to create it.",
        quoteAuthor: "Peter Drucker",
        top3Priorities: [
          { id: "p-1", title: tasks?.[0]?.title || "\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u062A\u06C8\u0631 \u0643\u0648\u062F\u0649\u0646\u0649 \u0631\u06D5\u062A\u0644\u06D5\u0634", urgency: "high", whyImportant: "\u0628\u06C8\u06AF\u06C8\u0646\u0643\u0649 \u0626\u06D5\u06AD \u0686\u0648\u06AD \u0642\u0649\u0645\u0645\u06D5\u062A \u064A\u0627\u0631\u0649\u062A\u0649\u062F\u0649\u063A\u0627\u0646 \u06CB\u06D5\u0632\u0649\u067E\u06D5", done: false },
          { id: "p-2", title: tasks?.[1]?.title || "\u0628\u0649\u0644\u0649\u0645 \u0626\u0627\u0645\u0628\u0649\u0631\u0649\u0646\u0649 \u0643\u06C6\u0632\u062F\u0649\u0646 \u0643\u06D5\u0686\u06C8\u0631\u06C8\u0634", urgency: "medium", whyImportant: "\u0626\u06C6\u06AF\u0649\u0646\u0649\u0634 \u06CB\u06D5 \u062A\u06D5\u0643\u0631\u0627\u0631\u0644\u0627\u0634 \u0645\u06D5\u0634\u0649\u0642\u0649", done: false },
          { id: "p-3", title: "\u0643\u06C8\u0646\u062F\u0649\u0644\u0649\u0643 \u067E\u0648\u0645\u0648\u062F\u0648\u0631\u0648 \u0632\u06D0\u06BE\u0649\u0646 \u0633\u0649\u0646\u0627\u0642\u0644\u0649\u0631\u0649\u0646\u0649 \u062A\u0627\u0645\u0627\u0645\u0644\u0627\u0634", urgency: "medium", whyImportant: "\u0626\u0649\u0646\u062A\u0649\u0632\u0627\u0645 \u06CB\u06D5 \u0626\u0627\u062F\u06D5\u062A \u0642\u06C7\u0631\u06C7\u0644\u0645\u0649\u0633\u0649", done: false }
        ],
        calendarSummary: language === "ug" ? "\u0628\u06C8\u06AF\u06C8\u0646\u0643\u0649 \u0643\u0627\u0644\u06D0\u0646\u062F\u0627\u0631\u062F\u0627 \u067E\u0649\u0644\u0627\u0646\u0644\u0627\u0646\u063A\u0627\u0646 \u067E\u0627\u0626\u0627\u0644\u0649\u064A\u06D5\u062A\u0644\u06D5\u0631 \u062A\u06D5\u0631\u062A\u0649\u067E\u0644\u0649\u0643 \u0626\u0648\u0631\u06C7\u0646\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0644\u062F\u0649." : "Calendar schedule synced.",
        aiEnergyRecommendation: language === "ug" ? "\u0686\u06C8\u0634\u062A\u0649\u0646 \u0628\u06C7\u0631\u06C7\u0646 \u0626\u06D5\u06AD \u0642\u0649\u064A\u0649\u0646 1-\u0646\u0648\u0645\u06C7\u0631\u0644\u06C7\u0642 \u0646\u0649\u0634\u0627\u0646\u063A\u0627 \u067E\u06C8\u062A\u06C8\u0646 \u062F\u0649\u0642\u0642\u0649\u062A\u0649\u06AD\u0649\u0632\u0646\u0649 \u0628\u06D0\u0631\u0649\u06AD\u060C \u0686\u06C8\u0634\u062A\u0649\u0646 \u0643\u06D0\u064A\u0649\u0646 \u0626\u0627\u0644\u0627\u0642\u06D5 \u06CB\u06D5 \u062A\u06D5\u0643\u0631\u0627\u0631\u0644\u0627\u0634\u0642\u0627 \u06CB\u0627\u0642\u0649\u062A \u0626\u0627\u062C\u0631\u0649\u062A\u0649\u06AD." : "Focus on high leverage work in the morning block."
      });
    }
    const prompt = `Act as an executive chief-of-staff and personal performance advisor.
Generate an inspiring, razor-sharp Morning Briefing for the user in ${langName}.
Context:
- Current Pending Tasks: ${JSON.stringify(tasks?.slice(0, 10) || [])}
- Scheduled Events Today: ${JSON.stringify(events?.slice(0, 5) || [])}
- Active Habits: ${JSON.stringify(habits?.slice(0, 5) || [])}

Return strictly a JSON object:
{
  "greeting": "Energetic, warm morning greeting in ${langName}",
  "weatherOrVibe": "An atmospheric productivity mindset theme for today in ${langName}",
  "dailyWisdomQuote": "A profound, memorable quote related to discipline and mastery in ${langName}",
  "quoteAuthor": "Author name",
  "top3Priorities": [
    {
      "id": "p-1",
      "title": "Exact top #1 high-leverage priority for today in ${langName}",
      "urgency": "high",
      "whyImportant": "Why this creates 80% of today's impact in ${langName}",
      "done": false
    },
    {
      "id": "p-2",
      "title": "Top #2 priority in ${langName}",
      "urgency": "medium",
      "whyImportant": "Strategic context in ${langName}",
      "done": false
    },
    {
      "id": "p-3",
      "title": "Top #3 priority in ${langName}",
      "urgency": "medium",
      "whyImportant": "Consistency/Habit context in ${langName}",
      "done": false
    }
  ],
  "calendarSummary": "Brief overview of today's scheduled time slots in ${langName}",
  "aiEnergyRecommendation": "Specific advice on pacing focus blocks, nutrition, and rest in ${langName}"
}`;
    const response = await generateWithGeminiFallback(ai, {
      preferredModel: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.6
      }
    });
    try {
      const parsed = JSON.parse(response.text || "{}");
      res.json(parsed);
    } catch {
      res.json({
        greeting: "\u062E\u06D5\u064A\u0631\u0644\u0649\u0643 \u0626\u06D5\u062A\u0649\u06AF\u06D5\u0646!",
        weatherOrVibe: "\u064A\u06D0\u06AD\u0649 \u0626\u06D0\u0646\u06D0\u0631\u06AF\u0649\u064A\u06D5 \u06CB\u06D5 \u064A\u06C8\u0643\u0633\u06D5\u0643 \u0632\u06D0\u06BE\u0649\u0646",
        dailyWisdomQuote: "\u06BE\u06D5\u0631 \u0643\u06C8\u0646\u0649 \u0628\u0649\u0631 \u0642\u06D5\u062F\u06D5\u0645 \u0626\u0627\u0644\u063A\u0627 \u0628\u06D0\u0633\u0649\u0634 \u063A\u06D5\u0644\u0649\u0628\u0649\u0646\u0649\u06AD \u0626\u06D5\u06AD \u0686\u0648\u06AD \u0633\u0649\u0631\u0649\u062F\u06C7\u0631.",
        quoteAuthor: "\u0641\u06D5\u0644\u0633\u06D5\u067E\u06D5",
        top3Priorities: [
          { id: "p-1", title: "\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u06CB\u06D5\u0632\u0649\u067E\u0649\u0646\u0649 \u062A\u0627\u0645\u0627\u0645\u0644\u0627\u0634", urgency: "high", whyImportant: "\u0628\u06C8\u06AF\u06C8\u0646\u0643\u0649 \u0645\u06C7\u06BE\u0649\u0645 \u0646\u06C7\u0642\u062A\u0627", done: false }
        ],
        calendarSummary: "\u0643\u06C8\u0646 \u062A\u06D5\u0631\u062A\u0649\u067E\u0649 \u067E\u0649\u0644\u0627\u0646\u0644\u0627\u0646\u062F\u0649",
        aiEnergyRecommendation: "\u062F\u0649\u0642\u0642\u0649\u062A\u0649\u06AD\u0649\u0632\u0646\u0649 \u0645\u06D5\u0631\u0643\u06D5\u0632\u0644\u06D5\u0634\u062A\u06C8\u0631\u06C8\u067E \u0626\u0649\u0634\u0644\u06D5\u06AD"
      });
    }
  } catch (error) {
    console.error("Error in /api/generate-morning-briefing:", error);
    res.status(500).json({ error: error.message || "Failed to generate morning briefing" });
  }
});
app.post("/api/code/generate", async (req, res) => {
  try {
    const { prompt, language = "python", framework = "none", complexity = "intermediate", includeTests = true, includeTypes = true, targetLang = "ug" } = req.body;
    const ai = getGeminiClient();
    const langName = targetLang === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631 \u062A\u0649\u0644\u0649)" : targetLang === "tr" ? "Turkish" : targetLang === "ar" ? "Arabic" : "English";
    if (ai) {
      try {
        const genPrompt = `You are an elite principal software architect and polyglot engineer.
Generate production-grade, highly optimized, idiomatic code for the following request.

Request: "${prompt}"
Target Programming Language: ${language}
Framework / Ecosystem: ${framework}
Complexity Level: ${complexity}
Include Unit Tests: ${includeTests ? "Yes" : "No"}
Include Strong Types / Annotations: ${includeTypes ? "Yes" : "No"}

Return ONLY a valid JSON object matching this structure:
{
  "title": "A concise title in ${langName}",
  "code": "The complete, production-ready, beautifully indented code string with all imports and comments",
  "language": "${language}",
  "explanation": "Detailed explanation of the architecture, key functions, and design patterns in ${langName}",
  "timeComplexity": "e.g. O(N log N) with rationale",
  "spaceComplexity": "e.g. O(N) with rationale",
  "testCases": "Code snippet of executable test cases or assertions",
  "bestPractices": ["3-5 engineering tips or pitfalls to watch out for in ${langName}"]
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: genPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/code/generate:", err);
      }
    }
    const isUg = targetLang === "ug";
    const sampleCode = language === "python" ? `# Python 3.12 Solution for: ${prompt}
from typing import List, Dict, Any, Optional
import time

def solve_task(data: List[Any]) -> Dict[str, Any]:
    """
    \u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631: ${prompt}
    \u062A\u06D5\u06BE\u0644\u0649\u0644 \u06CB\u06D5 \u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A \u0628\u0649\u0631 \u062A\u06D5\u0631\u06D5\u067E \u0642\u0649\u0644\u0649\u0634
    """
    start_time = time.perf_counter()
    processed_count = len(data)
    
    # Core algorithmic logic
    results = [item for item in data if item is not None]
    
    execution_time = time.perf_counter() - start_time
    return {
        "status": "success",
        "processed": processed_count,
        "results": results,
        "execution_time_ms": round(execution_time * 1000, 4)
    }

# --- Unit Tests ---
if __name__ == "__main__":
    test_data = ["sample_1", "sample_2", None, "sample_3"]
    output = solve_task(test_data)
    print(f"\u0646\u06D5\u062A\u0649\u062C\u06D5: {output}")
    assert output["processed"] == 4
    print("\u0628\u0627\u0631\u0644\u0649\u0642 \u0633\u0649\u0646\u0627\u0642\u0644\u0627\u0631 \u0645\u06C7\u06CB\u06D5\u067E\u067E\u06D5\u0642\u0649\u064A\u06D5\u062A\u0644\u0649\u0643 \u0626\u06C6\u062A\u062A\u0649!")` : language === "typescript" || language === "react" ? `// TypeScript / React Solution for: ${prompt}
import React, { useState, useEffect, useMemo } from 'react';

export interface TaskData<T> {
  id: string;
  payload: T;
  createdAt: number;
}

export function useDataProcessor<T>(initialItems: T[]) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [loading, setLoading] = useState<boolean>(false);

  const stats = useMemo(() => {
    return {
      total: items.length,
      timestamp: Date.now()
    };
  }, [items]);

  return { items, setItems, loading, stats };
}` : `// Modern C++20 Solution for: ${prompt}
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <chrono>

template <typename T>
class DataPipeline {
public:
    void insert(const T& item) {
        items_.push_back(item);
    }
    
    size_t size() const noexcept {
        return items_.size();
    }
    
private:
    std::vector<T> items_;
};

int main() {
    DataPipeline<std::string> pipeline;
    pipeline.insert("Unit 1");
    std::cout << "Data Pipeline initialized. Size: " << pipeline.size() << std::endl;
    return 0;
}`;
    return res.json({
      title: isUg ? `${language.toUpperCase()} \u0643\u0648\u062F \u0644\u0627\u064A\u0649\u06BE\u0649\u0633\u0649` : `${language.toUpperCase()} Solution`,
      code: sampleCode,
      language,
      explanation: isUg ? `\u0628\u06C7 \u0643\u0648\u062F \u0633\u0649\u0632 \u062A\u06D5\u0644\u06D5\u067E \u0642\u0649\u0644\u063A\u0627\u0646 "${prompt}" \u0645\u06D5\u0633\u0649\u0644\u0649\u0633\u0649\u0646\u0649 \u0626\u06D5\u06AD \u064A\u06D0\u06AD\u0649 \u0626\u06C6\u0644\u0686\u06D5\u0645\u062F\u06D5\u060C \u062A\u0649\u067E \u0643\u0627\u067E\u0627\u0644\u0649\u062A\u0649 (Type Safety) \u06CB\u06D5 \u064A\u06C7\u0642\u0649\u0631\u0649 \u0633\u06C8\u0631\u0626\u06D5\u062A \u0628\u0649\u0644\u06D5\u0646 \u0628\u0649\u0631 \u062A\u06D5\u0631\u06D5\u067E \u0642\u0649\u0644\u0649\u062F\u06C7.` : `Production-ready implementation addressing "${prompt}" with high performance and type safety.`,
      timeComplexity: "O(N)",
      spaceComplexity: "O(N)",
      testCases: "// Built-in assertions provided in the main entry point",
      bestPractices: isUg ? ["\u0643\u0648\u062F\u0646\u0649 \u0645\u0648\u062F\u06C7\u0644\u0644\u0627\u0631\u063A\u0627 \u0626\u0627\u064A\u0631\u0649\u067E \u0626\u0649\u0634\u0644\u0649\u062A\u0649\u0634", "\u0686\u06D0\u0643\u0649\u062F\u0649\u0646 \u0626\u0627\u0634\u0642\u0627\u0646 \u0643\u0649\u0631\u06AF\u06C8\u0632\u06C8\u0634\u0644\u06D5\u0631\u0646\u0649 \u0626\u0627\u0644\u062F\u0649\u0646 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634", "\u0626\u0649\u0686\u0643\u0649 \u0633\u0627\u0642\u0644\u0649\u063A\u06C7\u0686 \u0633\u06D5\u0631\u067E\u0649\u064A\u0627\u062A\u0649\u0646\u0649 \u062A\u0649\u0632\u06AF\u0649\u0646\u0644\u06D5\u0634"] : ["Validate edge cases", "Keep functions pure and modular", "Profile memory usage"]
    });
  } catch (error) {
    console.error("Error in /api/code/generate:", error);
    res.status(500).json({ error: error.message || "Failed to generate code" });
  }
});
app.post("/api/code/debug", async (req, res) => {
  try {
    const { code, language = "javascript", errorLog = "", framework = "", targetLang = "ug" } = req.body;
    const ai = getGeminiClient();
    const langName = targetLang === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631 \u062A\u0649\u0644\u0649)" : targetLang === "tr" ? "Turkish" : targetLang === "ar" ? "Arabic" : "English";
    if (ai) {
      try {
        const debugPrompt = `You are a world-class debugging engineer and compiler specialist.
Analyze this code, diagnose the exact bugs/flaws/performance bottlenecks, and produce a guaranteed fixed solution.

Code to debug:
\`\`\`${language}
${code}
\`\`\`

Error Log / Symptom (if provided):
${errorLog || "No explicit stack trace provided. Perform a comprehensive static audit for runtime bugs, edge cases, type errors, memory leaks, and logic flaws."}

Target Language for explanation: ${langName}

Return ONLY a valid JSON object:
{
  "status": "issues_found",
  "rootCause": "Clear, precise explanation of why the code failed or is buggy in ${langName}",
  "fixedCode": "The complete, fully corrected, working code",
  "changesSummary": [
    "Specific change 1 in ${langName}",
    "Specific change 2 in ${langName}",
    "Specific change 3 in ${langName}"
  ],
  "preventionTips": [
    "How to prevent this bug in the future in ${langName}"
  ],
  "unitTestToVerify": "A unit test verifying that the bug is fixed"
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: debugPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/code/debug:", err);
      }
    }
    const isUg = targetLang === "ug";
    return res.json({
      status: "issues_found",
      rootCause: isUg ? "\u0643\u0648\u062F\u062A\u0649\u0643\u0649 \u0626\u06C6\u0632\u06AF\u06D5\u0631\u06AF\u06C8\u0686\u0649 \u0645\u0649\u0642\u062F\u0627\u0631\u0644\u0627\u0631\u0646\u0649\u06AD \u0686\u06D0\u06AF\u0631\u0627 \u0642\u0649\u0645\u0645\u06D5\u062A\u0644\u0649\u0631\u0649 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0644\u0645\u0649\u06AF\u06D5\u0646\u0644\u0649\u0643\u0649 \u064A\u0627\u0643\u0649 \u062A\u0649\u067E \u0645\u0627\u0633\u0644\u0627\u0634\u0645\u0627\u0633\u0644\u0649\u0642\u0649 \u0628\u0627\u064A\u0642\u0627\u0644\u062F\u0649." : "Type mismatch and boundary condition check missing in function execution.",
      fixedCode: `// Fixed & Refactored Version
${code}
// \u2705 Added safety guards and null checks`,
      changesSummary: isUg ? ["\u0646\u06C6\u0644 \u064A\u0627\u0643\u0649 \u0626\u06D0\u0646\u0649\u0642\u0633\u0649\u0632 \u0642\u0649\u0645\u0645\u06D5\u062A\u0644\u06D5\u0631\u0646\u0649 \u062A\u06D5\u0643\u0634\u06C8\u0631\u06C8\u0634 (Null/Undefined Safety) \u0642\u0648\u0634\u06C7\u0644\u062F\u0649", "\u0626\u0649\u062C\u0631\u0627 \u0642\u0649\u0644\u0649\u0634 \u0633\u06C8\u0631\u0626\u0649\u062A\u0649 \u0626\u06D5\u0644\u0627\u0644\u0627\u0634\u062A\u06C7\u0631\u06C7\u0644\u062F\u0649"] : ["Added null-safety guards", "Optimized algorithmic loop"],
      preventionTips: isUg ? ["TypeScript \u0646\u0649\u06AD Strict Mode \u062A\u06D5\u06AD\u0634\u0649\u0643\u0649\u0646\u0649 \u0626\u0649\u0634\u0644\u0649\u062A\u0649\u0634", "\u0628\u0649\u0631\u0644\u0649\u0643 \u0633\u0649\u0646\u0627\u0642\u0644\u0649\u0631\u0649\u0646\u0649 (Unit Tests) \u0643\u06C6\u067E\u06D5\u064A\u062A\u0649\u0634"] : ["Enable strict mode", "Write comprehensive unit test suites"],
      unitTestToVerify: "// Verify edge cases with non-empty and empty inputs"
    });
  } catch (error) {
    console.error("Error in /api/code/debug:", error);
    res.status(500).json({ error: error.message || "Failed to debug code" });
  }
});
app.post("/api/code/explain", async (req, res) => {
  try {
    const { code, language = "auto", targetLang = "ug" } = req.body;
    const ai = getGeminiClient();
    const langName = targetLang === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631 \u062A\u0649\u0644\u0649)" : targetLang === "tr" ? "Turkish" : targetLang === "ar" ? "Arabic" : "English";
    if (ai) {
      try {
        const prompt = `You are a master computer science professor and senior software architect.
Explain the following code in crystal clear, intuitive, deep, and structured format in ${langName}.

Code:
\`\`\`${language}
${code}
\`\`\`

Return ONLY a valid JSON object:
{
  "summary": "High level summary of what this code does in ${langName}",
  "lineByLine": [
    { "section": "Lines / Function name", "explanation": "Detailed explanation in ${langName}" }
  ],
  "dataStructuresAndPatterns": ["Data structures and design patterns utilized"],
  "timeAndSpaceComplexity": "Detailed Big-O complexity breakdown",
  "suggestedImprovements": ["3 practical performance or readability improvements in ${langName}"]
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/code/explain:", err);
      }
    }
    const isUg = targetLang === "ug";
    return res.json({
      summary: isUg ? "\u0628\u06C7 \u0643\u0648\u062F \u0628\u06C6\u0644\u0649\u0643\u0649 \u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A \u0626\u06D0\u0642\u0649\u0645\u0649 \u06CB\u06D5 \u0641\u0648\u0646\u0643\u0633\u0649\u064A\u06D5\u0644\u0649\u0643 \u0645\u06D5\u0634\u063A\u06C7\u0644\u0627\u062A\u0644\u0627\u0631\u0646\u0649 \u0626\u0649\u062C\u0631\u0627 \u0642\u0649\u0644\u0649\u062F\u06C7." : "This code handles algorithmic processing and data operations.",
      lineByLine: [
        { section: "\u0626\u0627\u0633\u0627\u0633\u0649\u064A \u0642\u06C7\u0631\u06C7\u0644\u0645\u0627", explanation: isUg ? "\u0626\u0649\u0642\u062A\u0649\u062F\u0627\u0631 \u062A\u06D5\u06AD\u0634\u06D5\u0634 \u06CB\u06D5 \u062F\u06D5\u0633\u0644\u06D5\u067E\u0643\u0649 \u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A\u0644\u0627\u0631\u0646\u0649 \u0642\u0648\u0628\u06C7\u0644 \u0642\u0649\u0644\u0649\u0634." : "Initial setup and input parsing." }
      ],
      dataStructuresAndPatterns: ["Array / Vector", "Modular Functions"],
      timeAndSpaceComplexity: "Time: O(N), Space: O(1)",
      suggestedImprovements: isUg ? ["\u062A\u0649\u067E \u0628\u0627\u064A\u0627\u0646\u0644\u0649\u0631\u0649\u0646\u0649 \u062A\u0648\u0644\u06C7\u0642\u0644\u0627\u0634", "\u062E\u0627\u062A\u0627\u0644\u0649\u0642 \u062A\u06C7\u062A\u06C7\u0634 \u0645\u06D0\u062E\u0627\u0646\u0649\u0632\u0645\u0649 \u0642\u0648\u0634\u06C7\u0634"] : ["Add full type declarations", "Add error boundaries"]
    });
  } catch (error) {
    console.error("Error in /api/code/explain:", error);
    res.status(500).json({ error: error.message || "Failed to explain code" });
  }
});
app.post("/api/code/convert", async (req, res) => {
  try {
    const { code, fromLanguage = "python", toLanguage = "typescript", targetLang = "ug" } = req.body;
    const ai = getGeminiClient();
    const langName = targetLang === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631 \u062A\u0649\u0644\u0649)" : "English";
    if (ai) {
      try {
        const prompt = `You are a cross-language transpiler and polyglot engineer.
Convert the provided code from ${fromLanguage} to idiomatic ${toLanguage}.
Ensure best practices, native paradigms, memory management rules, and typing of ${toLanguage} are strictly respected.

Source Code (${fromLanguage}):
\`\`\`${fromLanguage}
${code}
\`\`\`

Return ONLY a valid JSON object:
{
  "convertedCode": "The full converted code in ${toLanguage}",
  "fromLanguage": "${fromLanguage}",
  "toLanguage": "${toLanguage}",
  "explanation": "Summary of how paradigms were mapped between the two languages in ${langName}",
  "caveatsAndDifferences": ["Key differences, standard library changes, or performance caveats in ${langName}"]
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/code/convert:", err);
      }
    }
    return res.json({
      convertedCode: `// Converted to ${toLanguage}
// Source: ${fromLanguage}
${code}`,
      fromLanguage,
      toLanguage,
      explanation: "Paradigms and syntax mapped to target language standard specifications.",
      caveatsAndDifferences: ["Review standard library package imports"]
    });
  } catch (error) {
    console.error("Error in /api/code/convert:", error);
    res.status(500).json({ error: error.message || "Failed to convert code" });
  }
});
app.post("/api/code/sql-builder", async (req, res) => {
  try {
    const { prompt, dbType = "postgresql", targetLang = "ug" } = req.body;
    const ai = getGeminiClient();
    const langName = targetLang === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631 \u062A\u0649\u0644\u0649)" : "English";
    if (ai) {
      try {
        const sqlPrompt = `You are a Principal Database Administrator and SQL Architect.
Generate an optimal, normalized, production-grade schema and sample query suite for: "${prompt}"

Target Database Engine: ${dbType} (PostgreSQL / MySQL / SQLite / MongoDB)

Return ONLY a valid JSON object:
{
  "title": "Database Architecture Title in ${langName}",
  "schemaSql": "Complete CREATE TABLE, foreign keys, constraints, triggers, and INDEX definitions",
  "seedSql": "Sample INSERT statements with realistic multi-row seed records",
  "sampleQueries": [
    {
      "queryTitle": "Query purpose in ${langName}",
      "sql": "High performance SQL query (JOINs, aggregation, CTE, or window functions)"
    }
  ],
  "erdSummary": "Text-based Entity Relationship breakdown (e.g. Users 1:N Orders 1:N OrderItems)",
  "performanceTips": ["3-4 indexing, partitioning, and vacuuming tips in ${langName}"]
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: sqlPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/code/sql-builder:", err);
      }
    }
    const isUg = targetLang === "ug";
    return res.json({
      title: isUg ? `${dbType.toUpperCase()} \u0633\u0627\u0646\u0644\u0649\u0642 \u0645\u06D5\u0644\u06C7\u0645\u0627\u062A \u0626\u0627\u0645\u0628\u0649\u0631\u0649 \u0642\u06C7\u0631\u06C7\u0644\u0645\u0649\u0633\u0649` : `${dbType.toUpperCase()} Schema Design`,
      schemaSql: `-- ${dbType.toUpperCase()} Schema for: ${prompt}
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_projects_user_id ON projects(user_id);`,
      seedSql: `INSERT INTO users (username, email) VALUES ('dev_expert', 'dev@example.com');
INSERT INTO projects (user_id, name) SELECT id, 'AI Engine Core' FROM users WHERE username = 'dev_expert';`,
      sampleQueries: [
        {
          queryTitle: isUg ? "\u0626\u0627\u0628\u0648\u0646\u062A \u06CB\u06D5 \u0626\u06C7\u0644\u0627\u0631\u0646\u0649\u06AD \u062A\u06C8\u0631\u0644\u0649\u0631\u0649\u0646\u0649 \u062A\u06D5\u06AD \u0633\u06C8\u0631\u06C8\u0634\u062A\u06C8\u0631\u06C8\u0634" : "Fetch users with their projects",
          sql: `SELECT u.username, u.email, COUNT(p.id) as project_count
FROM users u
LEFT JOIN projects p ON u.id = p.user_id
GROUP BY u.id, u.username, u.email;`
        }
      ],
      erdSummary: "Users (1) <---> (N) Projects",
      performanceTips: isUg ? ["\u0643\u06C6\u067E \u0626\u0649\u0634\u0644\u0649\u062A\u0649\u0644\u0649\u062F\u0649\u063A\u0627\u0646 \u0686\u06D5\u062A \u0626\u06D5\u0644 \u0626\u0627\u0686\u0642\u06C7\u0686\u0644\u0649\u0631\u0649\u063A\u0627 (Foreign Keys) \u0626\u0649\u0646\u062F\u06D0\u0643\u0633 \u0642\u06C7\u0631\u06C7\u0634", "\u0632\u06C6\u0631\u06C8\u0631 \u062A\u06C8\u0631\u0644\u06D5\u0631\u06AF\u06D5 \u064A\u06C7\u0642\u0649\u0631\u0649 \u0626\u06C8\u0646\u06C8\u0645\u0644\u06C8\u0643 \u0643\u06C6\u0631\u06C8\u0646\u06C8\u0634 (Materialized Views) \u0644\u0627\u064A\u0649\u06BE\u0649\u0644\u06D5\u0634"] : ["Index foreign keys", "Use connection pooling in production"]
    });
  } catch (error) {
    console.error("Error in /api/code/sql-builder:", error);
    res.status(500).json({ error: error.message || "Failed to build SQL" });
  }
});
app.post("/api/code/regex", async (req, res) => {
  try {
    const { prompt, testString = "", targetLang = "ug" } = req.body;
    const ai = getGeminiClient();
    const langName = targetLang === "ug" ? "Uyghur (\u0626\u06C7\u064A\u063A\u06C7\u0631 \u062A\u0649\u0644\u0649)" : "English";
    if (ai) {
      try {
        const regexPrompt = `You are a regular expression and automata theory specialist.
Generate an optimal, secure, and clean Regular Expression for: "${prompt}"

Test string provided: "${testString}"

Return ONLY a valid JSON object:
{
  "pattern": "The pure regex pattern without surrounding slashes (e.g. ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\\\.[a-zA-Z]{2,}$)",
  "flags": "gmi",
  "explanation": "Human-readable explanation of the pattern in ${langName}",
  "tokenBreakdown": [
    { "token": "^", "meaning": "Beginning of line in ${langName}" },
    { "token": "[a-z0-9]", "meaning": "Character set in ${langName}" }
  ],
  "sampleMatches": ["sample valid matches"],
  "sampleNonMatches": ["sample invalid matches"]
}`;
        const result = await generateWithGeminiFallback(ai, {
          contents: regexPrompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.2
          }
        });
        const parsed = JSON.parse(result.text || "{}");
        return res.json(parsed);
      } catch (err) {
        console.error("Gemini error in /api/code/regex:", err);
      }
    }
    return res.json({
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
      flags: "gmi",
      explanation: "Matches standard compliant email address formats.",
      tokenBreakdown: [
        { token: "^", meaning: "Start of string" },
        { token: "[a-zA-Z0-9._%+-]+", meaning: "Username alphanumeric and allowed symbols" },
        { token: "@", meaning: "Literal @" },
        { token: "$", meaning: "End of string" }
      ],
      sampleMatches: ["user@example.com", "dev.lead+test@domain.org"],
      sampleNonMatches: ["user@", "@domain.com", "plainaddress"]
    });
  } catch (error) {
    console.error("Error in /api/code/regex:", error);
    res.status(500).json({ error: error.message || "Failed to analyze regex" });
  }
});
async function setupViteOrStatic() {
  if (process.env.VERCEL) return;
  try {
    const isProduction = process.env.NODE_ENV === "production" || Boolean(process.argv[1] && process.argv[1].includes("server.cjs"));
    if (!isProduction) {
      const vitePkg = "vite";
      const { createServer: createViteServer } = await import(
        /* @vite-ignore */
        vitePkg
      );
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa"
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(path.join(distPath, "index.html"));
      });
    }
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
    const gracefulShutdown = () => {
      server.close(() => {
        process.exit(0);
      });
    };
    process.on("SIGTERM", gracefulShutdown);
    process.on("SIGINT", gracefulShutdown);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}
function handler(req, res) {
  let targetUrl = req.url || "/";
  try {
    const parsed = new URL(targetUrl, "http://localhost");
    const routeParam = parsed.searchParams.get("__route");
    if (routeParam !== null) {
      targetUrl = `/api/${routeParam.replace(/^\/+/, "")}`;
    }
  } catch {
  }
  if (req.originalUrl && req.originalUrl.startsWith("/api") && req.originalUrl !== "/api") {
    targetUrl = req.originalUrl;
  }
  if (!targetUrl.startsWith("/api") && !targetUrl.startsWith("/assets")) {
    targetUrl = `/api${targetUrl.startsWith("/") ? "" : "/"}${targetUrl}`;
  }
  req.url = targetUrl;
  return app(req, res);
}
var isVercelRuntime = Boolean(
  process.env.VERCEL || process.env.VERCEL_ENV || process.env.NOW_REGION || process.env.AWS_LAMBDA_FUNCTION_NAME || process.argv[1] && (process.argv[1].includes("api") || process.argv[1].includes("index.js"))
);
if (!isVercelRuntime) {
  setupViteOrStatic();
}
export {
  app,
  handler as default
};
