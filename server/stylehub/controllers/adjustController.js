/* the req.body contains the html file uploaded by the user and a suggestion.

prompt example: "Suggestion: Make the background color of the header blue. HTML file: <html><head></head><body><header>Header</header></body></html>"

Use axios to send the prompt to the AI model, mention to respond with the css added internally in the html file and receive the generated html-CSS code.
Send the huggingface API token in the request header for authentication as an environment variable.

Finally, send the generated code back to the client as a response.
*/
const axios = require("axios");

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

const extractGeneratedText = (hfData) => {
  if (Array.isArray(hfData)) {
    return hfData?.[0]?.generated_text || hfData?.[0]?.text || "";
  }
  return hfData?.generated_text || hfData?.text || "";
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

    const effectiveSuggestion =
      suggestion || "Make the background color of the header blue.";

    const huggingfaceToken =
      process.env.HUGGINGFACE_API_TOKEN ||
      process.env.HUGGINGFACE_TOKEN ||
      process.env.HF_TOKEN;

    if (!huggingfaceToken) {
      return res.status(500).json({
        error:
          "Missing Hugging Face token env var. Set `HUGGINGFACE_API_TOKEN` (or `HUGGINGFACE_TOKEN` / `HF_TOKEN`).",
      });
    }

    const model =
      process.env.HUGGINGFACE_MODEL || process.env.HF_MODEL || "microsoft/Phi-3-mini-4k-instruct";

    // Important: request the model to return ONLY the updated HTML document,
    // with CSS embedded internally so we can send it straight to the client.
    const prompt = [
      "You are a helpful assistant that edits HTML and embedded CSS.",
      "Task:",
      `Suggestion: ${effectiveSuggestion}`,
      "HTML file:",
      html,
      "",
      "Return ONLY the complete updated HTML document.",
      "The CSS must be added internally in the HTML (e.g., inside a <style> tag in <head>).",
      "Do not add explanations, markdown, or code fences. Output only HTML.",
    ].join("\n");

    const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;

    const hfResponse = await axios.post(
      url,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 900,
          temperature: 0.2,
          top_p: 0.9,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${huggingfaceToken}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const generatedText = extractGeneratedText(hfResponse.data);
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
      error: "Failed to adjust HTML via Hugging Face.",
      details: hfError,
    });
  }
};

module.exports = {
  adjustPrompt,
};
