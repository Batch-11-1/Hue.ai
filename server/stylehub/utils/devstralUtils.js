/*
 * devstralUtils.js
 * Base interface wrapper allowing backend services to transparently request OpenRouter or Mistral APIs.
 */
const axios = require("axios");

// Executes the request against the devstral-based AI endpoint and returns completion contents
async function callDevstral(prompt, options = {}) {
  const apiKey = (process.env.DEVSTRAL_API_KEY || "").trim().replace(/^["']|["']$/g, "");

  if (!apiKey || apiKey === "undefined" || apiKey === "null") {
    throw new Error(
      "Missing Devstral API key. Please check your .env file and ensure DEVSTRAL_API_KEY is set."
    );
  }

  // Auto-detect endpoint based on API key length (Mistral is 32, OpenRouter is longer)
  const isMistral = apiKey.length === 32;
  const endpoint =
    options.endpoint ||
    (isMistral
      ? "https://api.mistral.ai/v1/chat/completions"
      : "https://openrouter.ai/api/v1/chat/completions");

  const model =
    options.model ||
    process.env.DEVSTRAL_MODEL ||
    (isMistral ? "codestral-latest" : "mistralai/devstral-small:free");

  const maxTokens =
    options.maxOutputTokens ||
    options.maxTokens ||
    Number(process.env.DEVSTRAL_MAX_OUTPUT_TOKENS || 1400);

  const temperature =
    options.temperature !== undefined
      ? options.temperature
      : Number(process.env.DEVSTRAL_TEMPERATURE || 0.3);

  const systemPrompt =
    options.systemPrompt || "You are a helpful frontend developer assistant.";

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: String(prompt) },
  ];

  const response = await axios.post(
    endpoint,
    {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: options.timeout || 120000,
    }
  );

  const content = response?.data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.trim().length === 0) {
    throw new Error(
      `Invalid response from Devstral API: ${JSON.stringify(response?.data)}`
    );
  }

  return content;
}

module.exports = { callDevstral };
