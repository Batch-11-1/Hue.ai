/* the req.body contatins two html files already styled and the user input to repeat the styling of one file to the other.

prompt example: "Repeat the styling of file1.html to file2.html, only change the content but keep the same structure and styling. Respond with the new html file with the css added internally in the html file."

Use axios to send the prompt to the AI model, mention to respond with the css added internally in the html file and receive the generated html-CSS code.
Send the huggingface API token in the request header for authentication as an environment variable.

Finally, send the generated code back to the client as a response.
*/
const axios = require("axios");

function pickFirstString(obj, keys) {
  if (!obj || typeof obj !== "object") return "";
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function extractGeneratedText(hfData) {
  // Common HF Inference shapes:
  // - [{ generated_text: "..." }]
  // - { generated_text: "..." }
  // - { error: "...", estimated_time: ... }
  if (!hfData) return "";

  if (Array.isArray(hfData)) {
    const first = hfData[0];
    if (first && typeof first.generated_text === "string") return first.generated_text;
    if (first && typeof first.text === "string") return first.text;
  }

  if (typeof hfData === "object") {
    if (typeof hfData.generated_text === "string") return hfData.generated_text;
    if (typeof hfData.text === "string") return hfData.text;
  }

  return "";
}

const repeatPrompt = async (req, res, next) => {
  try {
    console.log("repeatController.repeatPrompt called");

    const token = process.env.HUGGINGFACE_API_TOKEN || process.env.HF_API_TOKEN;
    if (!token) {
      return res
        .status(500)
        .json({ error: "Missing Hugging Face API token in environment variables." });
    }

    const model =
      process.env.HUGGINGFACE_MODEL ||
      process.env.HF_MODEL ||
      "mistralai/Mistral-7B-Instruct-v0.2";

    const styledHtml = pickFirstString(req.body, [
      "styledHtml",
      "sourceHtml",
      "file1Html",
      "html1",
      "baseHtml",
      "fromHtml",
      "file1",
    ]);
    const targetHtml = pickFirstString(req.body, [
      "targetHtml",
      "destHtml",
      "file2Html",
      "html2",
      "toHtml",
      "file2",
    ]);
    const userInstruction = pickFirstString(req.body, [
      "instruction",
      "prompt",
      "userInput",
      "message",
      "request",
      "text",
    ]);

    if (!styledHtml || !targetHtml) {
      return res.status(400).json({
        error:
          "Missing required fields in req.body. Provide the styled/source HTML and the target HTML.",
        expectedFields: {
          styledHtml:
            "One of: styledHtml, sourceHtml, file1Html, html1, baseHtml, fromHtml, file1",
          targetHtml:
            "One of: targetHtml, destHtml, file2Html, html2, toHtml, file2",
          instruction: "Optional: instruction / prompt / userInput / message",
        },
      });
    }

    const prompt = [
      "You are a frontend expert.",
      "Task: Transfer the styling and overall structure from the STYLED HTML into the TARGET HTML content.",
      "Rules:",
      "- Keep the styling consistent with the STYLED HTML (colors, spacing, typography, layout).",
      "- Update only the content to match the TARGET HTML (text, images, links, sections), but preserve the style/structure where reasonable.",
      "- Output must be exactly ONE complete HTML document.",
      "- Put ALL CSS internally inside a single <style> tag in the <head>. No external CSS files.",
      "- Do not include markdown fences, explanations, or extra text. Output ONLY the final HTML.",
      userInstruction ? `User instruction: ${userInstruction}` : null,
      "",
      "STYLED HTML:",
      styledHtml,
      "",
      "TARGET HTML (content to apply styling to):",
      targetHtml,
      "",
      "Return ONLY the final HTML document now.",
    ]
      .filter(Boolean)
      .join("\n");

    const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;

    const hfResponse = await axios.post(
      url,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: Number(process.env.HF_MAX_NEW_TOKENS || 1800),
          temperature: Number(process.env.HF_TEMPERATURE || 0.2),
          return_full_text: false,
        },
        options: { wait_for_model: true },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: Number(process.env.HF_TIMEOUT_MS || 120000),
      }
    );

    const generated = extractGeneratedText(hfResponse.data)?.trim();
    if (!generated) {
      const errMsg =
        (hfResponse.data && hfResponse.data.error) ||
        "No generated HTML returned from the model.";
      return res.status(502).json({
        error: errMsg,
        details: hfResponse.data,
      });
    }

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(200).send(generated);
  } catch (err) {
    // Normalize common axios/HF errors into useful responses.
    if (err?.response) {
      const status = err.response.status || 502;
      const data = err.response.data;
      return res.status(status).json({
        error:
          (data && data.error) ||
          `Hugging Face request failed with status ${status}.`,
        details: data,
      });
    }
    return next(err);
  }
};
module.exports = {
  repeatPrompt,
};
