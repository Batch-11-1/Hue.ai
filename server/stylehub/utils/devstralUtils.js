const axios = require("axios");

async function callDevstral(prompt, options = {}) {
  const rawApiKey =
    process.env.OPENROUTER_API_KEY ||
    process.env.DEVSTRAL_API_KEY ||
    process.env.MISTRAL_API_KEY;

  const apiKey = typeof rawApiKey === "string"
    ? rawApiKey.trim().replace(/^["']|["']$/g, "")
    : rawApiKey;

  if (!apiKey || apiKey === "undefined" || apiKey === "null") {
    throw new Error(
      "Missing Devstral API key. Please check your .env file and ensure OPENROUTER_API_KEY or DEVSTRAL_API_KEY is set."
    );
  }

  const useMistral =
    (!!process.env.MISTRAL_API_KEY && !process.env.OPENROUTER_API_KEY) ||
    apiKey.length === 32; // Mistral keys are typically 32 chars without prefix

  const endpoint =
    options.endpoint ||
    process.env.DEVSTRAL_API_URL ||
    (useMistral
      ? "https://api.mistral.ai/v1/chat/completions"
      : "https://openrouter.ai/api/v1/chat/completions");
  const normalizedEndpoint = String(endpoint).trim();

  const model =
    options.model ||
    process.env.DEVSTRAL_MODEL ||
    (useMistral ? "codestral-latest" : "mistralai/devstral-small:free");

  const maxTokens =
    options.maxOutputTokens ||
    options.maxTokens ||
    Number(process.env.DEVSTRAL_MAX_OUTPUT_TOKENS || 1400);

  const temperature =
    options.temperature !== undefined
      ? options.temperature
      : Number(process.env.DEVSTRAL_TEMPERATURE || 0.3);

  const systemPrompt =
    options.systemPrompt ||
    process.env.DEVSTRAL_SYSTEM_PROMPT ||
    "You are a helpful frontend developer assistant.";

  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: String(prompt) },
  ];

  const response = await axios.post(
    normalizedEndpoint,
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
        ...(process.env.OPENROUTER_HTTP_REFERER
          ? { "HTTP-Referer": process.env.OPENROUTER_HTTP_REFERER }
          : {}),
        ...(process.env.OPENROUTER_APP_TITLE
          ? { "X-Title": process.env.OPENROUTER_APP_TITLE }
          : {}),
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
