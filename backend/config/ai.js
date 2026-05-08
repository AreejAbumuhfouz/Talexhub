'use strict';

// ══════════════════════════════════════════════════════════
// File: backend/config/ai.js
//
// DeepSeek API — uses the OpenAI SDK (fully compatible)
// DeepSeek is ~90% cheaper than GPT-4o with similar quality
//
// .env:
//   DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxx
//   AI_PROVIDER=deepseek          (or 'openai' to switch back)
//   DEEPSEEK_MODEL=deepseek-chat  (DeepSeek V3)
//   OPENAI_API_KEY=sk-...         (optional fallback)
// ══════════════════════════════════════════════════════════

const OpenAI = require('openai');

const PROVIDER = process.env.AI_PROVIDER || 'deepseek';

// ── DeepSeek client ────────────────────────────────────────
const deepseek = new OpenAI({
  apiKey:  process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com',
});

// ── OpenAI client (fallback) ───────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Active client + model ──────────────────────────────────
const client = PROVIDER === 'openai' ? openai : deepseek;
const MODEL  = PROVIDER === 'openai'
  ? (process.env.OPENAI_MODEL    || 'gpt-4o')
  : (process.env.DEEPSEEK_MODEL  || 'deepseek-chat');

// ── Shared chat wrapper ────────────────────────────────────
const chat = async ({ system, user, temperature = 0.3, maxTokens = 2000, json = false }) => {
  const messages = [
    { role: 'system', content: system },
    { role: 'user',   content: user   },
  ];

  const options = {
    model:       MODEL,
    messages,
    temperature,
    max_tokens:  maxTokens,
  };

  // DeepSeek supports JSON mode too
  if (json) {
    options.response_format = { type: 'json_object' };
  }

  const res = await client.chat.completions.create(options);
  return res.choices[0].message.content;
};

module.exports = { client, MODEL, chat, PROVIDER };