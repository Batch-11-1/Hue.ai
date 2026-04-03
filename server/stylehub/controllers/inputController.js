const { callGemini } = require('../utils/geminiUtils');

function extractFirstHtmlDocument(text) {
  if (typeof text !== "string") return text;
  const htmlStart = text.indexOf("<html");
  if (htmlStart === -1) return text;
  const htmlEnd = text.lastIndexOf("</html>");
  if (htmlEnd === -1) return text.slice(htmlStart);
  return text.slice(htmlStart, htmlEnd + "</html>".length);
}

function getBodyValue(reqBody, keys) {
  for (const key of keys) {
    if (reqBody && reqBody[key] !== undefined) return reqBody[key];
  }
  return undefined;
}

const initiatePrompt = async (req, res) => {
  try {
    console.log("inputController.initiatePrompt called");

    const contentType = (req.headers['content-type'] || '').toLowerCase();
    if (!contentType.includes('application/json') && !contentType.includes('application/x-www-form-urlencoded')) {
      console.warn("inputController.initiatePrompt unsupported content-type:", contentType);
      return res.status(415).send("Unsupported Content-Type. Use application/json or application/x-www-form-urlencoded.");
    }

    console.debug("inputController.initiatePrompt req.body:", req.body);

    const htmlFile = getBodyValue(req.body, [
      "html",
      "htmlFile",
      "html_file",
      "htmlContent",
      "html_content",
    ]);
    const layout = getBodyValue(req.body, [
      "layout",
      "layoutChoice",
      "layout_choice",
    ]);
    const colorScheme = getBodyValue(req.body, [
      "colorScheme",
      "color_scheme",
      "colors",
      "color",
    ]);
    const fontStyle = getBodyValue(req.body, ["fontStyle", "font_style", "font"]);
    
    if (!htmlFile || !layout || !colorScheme || !fontStyle) {
      return res.status(400).send(
        "Missing required fields: htmlFile(html), layout, colorScheme(colors), fontStyle(font)"
      );
    }


    const prompt = [
      "You are a web designer and CSS generator.",
      "Task: Modify the provided HTML to match the requested layout, color scheme, and font style.",
      "",
      "Requirements:",
      "1. Add CSS internally by including it in a <style> tag inside the <head> of the returned HTML.",
      "2. Keep the HTML structure/semantic tags (header/main/footer) consistent with the input; only adjust/add elements if required by the selected layout.",
      "3. Use the chosen font style group and color scheme across the page.",
      "4. Return ONLY the complete HTML document (no markdown, no explanations).",
      "",
      `Layout: ${layout}.`,
      `Color scheme: ${colorScheme}.`,
      `Font style: ${fontStyle}.`,
      "",
      "HTML file:",
      String(htmlFile),
    ].join("\n");

    const generatedText = await callGemini(prompt, {
      maxOutputTokens: 800,
      temperature: 0.7
    });

    const htmlCssCode = extractFirstHtmlDocument(generatedText);
    return res.status(200).send(htmlCssCode);
  } catch (err) {
    console.error("initiatePrompt error:", {
      status: err?.response?.status,
      statusText: err?.response?.statusText,
      data: err?.response?.data,
      message: err?.message,
    });
    const errorDetails = err?.response?.data?.error || err?.message || 'Unknown error';
    return res.status(500).send(`Failed to generate HTML/CSS from AI model. Details: ${errorDetails}`);
  }
};

module.exports = {
  initiatePrompt,
};
