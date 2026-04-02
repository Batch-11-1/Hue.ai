/* The req.body contains:
 * - the HTML file content uploaded by the user
 * - the selected layout
 * - the selected color scheme
 * - the selected font style
 *
 * This handler builds a prompt, sends it to a Hugging Face model via axios,
 * and returns generated HTML where the CSS is added internally (within a
 * <style> tag in the <head>).
 */
const axios = require("axios");

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
      "3. Use the chosen font style and color scheme across the page.",
      "4. Return ONLY the complete HTML document (no markdown, no explanations).",
      "",
      `Layout: ${layout}.`,
      `Color scheme: ${colorScheme}.`,
      `Font style: ${fontStyle}.`,
      "",
      "HTML file:",
      String(htmlFile),
    ].join("\n");

    const token =
      process.env.HUGGINGFACE_API_TOKEN ||
      process.env.HF_API_TOKEN ||
      process.env.HF_TOKEN;
    const model = process.env.HUGGINGFACE_MODEL || process.env.HF_MODEL;

    if (!token) {
      return res.status(500).send(
        "Hugging Face API token missing. Set HUGGINGFACE_API_TOKEN (or HF_API_TOKEN/HF_TOKEN)."
      );
    }
    if (!model) {
      return res.status(500).send(
        "Hugging Face model missing. Set HUGGINGFACE_MODEL (or HF_MODEL)."
      );
    }

    const url = `https://api-inference.huggingface.co/models/${model}`;

    const axiosResponse = await axios.post(
      url,
      {
        inputs: prompt,
        parameters: {
          // Works for many text-generation models on HF Inference.
          max_new_tokens: 800,
          temperature: 0.7,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 120000,
      }
    );

    const data = axiosResponse.data;

    let generatedText;
    if (typeof data === "string") {
      generatedText = data;
    } else if (data && typeof data === "object" && data.generated_text) {
      generatedText = data.generated_text;
    } else if (Array.isArray(data) && data[0]?.generated_text) {
      generatedText = data[0].generated_text;
    } else {
      generatedText = JSON.stringify(data, null, 2);
    }

    const htmlCssCode = extractFirstHtmlDocument(generatedText);
    return res.status(200).send(htmlCssCode);
  } catch (err) {
    console.error(
      "initiatePrompt error:",
      err?.response?.data || err?.message || err
    );
    return res.status(500).send("Failed to generate HTML/CSS from AI model.");
  }
};

module.exports = {
  initiatePrompt,
};
