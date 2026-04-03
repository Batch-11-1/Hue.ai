const { callGemini } = require('../utils/geminiUtils');

const stripCodeFences = (text) => {
  if (typeof text !== "string") return "";
  let out = text.trim();

  // Handle common LLM formatting like:
  // ```html ... ```
  out = out.replace(/^```(?:html|css|xml)?\s*/i, "");
  out = out.replace(/```$/i, "").trim();

  // If the model returns extra text around the HTML, keep the first HTML document.
  const start = out.indexOf("<html");
  const end = out.lastIndexOf("</html>");
  if (start !== -1 && end !== -1 && end > start) {
    out = out.slice(start, end + "</html>".length);
  }

  return out;
};

const adjustPrompt = async (req, res) => {
  try {
    console.log("adjustController.adjustPrompt called");

    const html =
      req.body?.html ||
      req.body?.htmlFile ||
      req.body?.file ||
      req.body?.code;
    const suggestion =
      req.body?.suggestion || req.body?.prompt || req.body?.answer;

    if (!html) {
      return res.status(400).json({
        error: "Missing required field: `html` (or `htmlFile` / `code`).",
      });
    }

    // Important: request the model to return ONLY the updated HTML document,
    // with CSS embedded internally so we can send it straight to the client.
    const prompt = [
      "You are a helpful assistant that edits HTML and embedded CSS.",
      "Task:",
      `Suggestion: ${suggestion}`,
      "HTML file:",
      html,
      "",
      "Return ONLY the complete updated HTML document.",
      "The CSS must be added internally in the HTML (e.g., inside a <style> tag in <head>).",
      "Do not add explanations, markdown, or code fences. Output only HTML.", "Keep the structure of the original HTML intact, and only modify it as needed to implement the suggestion.",
    ].join("\n");

    const generatedText = await callGemini(prompt, {
      maxOutputTokens: 900,
      temperature: 0.2
    });
    const generatedHtml = stripCodeFences(generatedText);

    if (!generatedHtml) {
      return res.status(502).json({
        error: "AI model returned an empty response.",
      });
    }

    // Send generated HTML back to the client.
    return res.send(generatedHtml);
  } catch (err) {
    console.error("adjustController.adjustPrompt error:", err?.message || err);
    const hfError =
      err?.response?.data?.error || err?.response?.data || null;

    return res.status(500).json({
      error: "Failed to adjust HTML via AI.",
      details: hfError,
    });
  }
};

module.exports = {
  adjustPrompt,
};
