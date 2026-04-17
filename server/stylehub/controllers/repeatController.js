const { callDevstral } = require("../utils/devstralUtils");

const pickFirstString = (obj, keys) => {
  if (!obj || typeof obj !== 'object') return null;
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === 'string' && value.trim().length > 0) return value;
  }
  return null;
};

const repeatPrompt = async (req, res, next) => {
  try {
    console.log("repeatController.repeatPrompt called");

    const devstralApiKey =
      process.env.OPENROUTER_API_KEY || process.env.DEVSTRAL_API_KEY;

    if (!devstralApiKey) {
      return res
        .status(500)
        .json({
          error:
            "Missing Devstral API key in environment variables. Set OPENROUTER_API_KEY (or DEVSTRAL_API_KEY).",
        });
    }

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

    const generated = await callDevstral(prompt, {
      maxOutputTokens: Number(process.env.DEVSTRAL_MAX_OUTPUT_TOKENS || 1800),
      temperature: Number(process.env.DEVSTRAL_TEMPERATURE || 0.2)
    });
    if (!generated) {
      const errMsg = "No generated HTML returned from the model.";
      return res.status(502).json({
        error: errMsg,
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
          `Devstral request failed with status ${status}.`,
        details: data,
      });
    }
    return next(err);
  }
};
module.exports = {
  repeatPrompt,
};
