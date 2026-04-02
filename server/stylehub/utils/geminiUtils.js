const { GoogleGenAI } = require('@google/genai');

async function callGemini(prompt, options = {}) {
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Google API key. Set GOOGLE_API_KEY in environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const model =
    options.model ||
    process.env.GEMINI_MODEL ||
    process.env.GENERATIVE_MODEL ||
    'gemini-2.5-flash';

  const maxOutputTokens =
    options.maxOutputTokens ||
    Number(process.env.GEMINI_MAX_OUTPUT_TOKENS || process.env.GENERATIVE_MAX_OUTPUT_TOKENS || 800);

  const temperature =
    options.temperature ||
    Number(process.env.GEMINI_TEMPERATURE || process.env.GENERATIVE_TEMPERATURE || 0.7);

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    temperature,
    maxOutputTokens,
    ...options.config,
  });

  if (!response || typeof response.text !== 'string') {
    throw new Error('Invalid response from Gemini API: ' + JSON.stringify(response));
  }

  return response.text;
}

module.exports = { callGemini };