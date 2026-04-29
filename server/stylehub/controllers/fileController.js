/*
 * fileController.js
 * Controller handling the extraction of inline CSS from finished layouts and converting it into downloadable CSS files.
 */

/**
 * Tries to locate the incoming HTML string from a urlencoded form body.
 * The client can send it under different keys depending on implementation.
 */
const getHtmlFromRequest = (req) => {
  const body = req.body ?? {};

  const candidates = [
    "html",
    "HTML",
    "htmlFile",
    "html_file",
    "file",
    "data",
    "content",
    "htmlContent",
    "html_content",
  ];

  for (const key of candidates) {
    if (typeof body[key] === "string" && body[key].trim().length > 0) return body[key];
  }

  // Fallback: if the payload only has one field, treat it as the HTML.
  const keys = Object.keys(body);
  if (keys.length === 1 && typeof body[keys[0]] === "string") return body[keys[0]];

  return null;
};

// Main handler extracting CSS content from a generated HTML representation
const fileDownload = (req, res) => {
  try {
    const html = getHtmlFromRequest(req);
    if (!html) {
      return res.status(400).json({
        error: "Missing HTML input. Provide a form field like `html` containing the full HTML string.",
      });
    }

    // Extract all <style> blocks (including attributes on the <style> tag).
    const styleTagRegex = /<style\b[^>]*>([\s\S]*?)<\/style>/gi;
    const cssChunks = [];
    let match;
    while ((match = styleTagRegex.exec(html)) !== null) {
      // match[1] is the CSS content inside the style tag
      cssChunks.push(match[1]);
    }

    const extractedCss = cssChunks.join("\n").trim();

    // Remove all internal <style> tags from the HTML.
    // (Recreate the regex to avoid any issues with `lastIndex` after the exec loop.)
    const removeStyleTagRegex = /<style\b[^>]*>[\s\S]*?<\/style>/gi;
    const htmlWithoutStyles = html.replace(removeStyleTagRegex, "").trim();

    const cssFileName = "styles.css";

    // Insert <link> into <head>, or add a head if one doesn't exist.
    let modifiedHtml = htmlWithoutStyles;
    const linkTag = `<link rel="stylesheet" href="${cssFileName}" />`;

    const headRegex = /<head\b[^>]*>/i;
    const hasLinkToCss = new RegExp(
      `<link\\s+[^>]*href=["']${cssFileName}["']\\s*\\/?>`,
      "i"
    ).test(modifiedHtml);

    if (!hasLinkToCss) {
      if (headRegex.test(modifiedHtml)) {
        modifiedHtml = modifiedHtml.replace(headRegex, (headTag) => `${headTag}\n  ${linkTag}`);
      } else {
        // If there's no <head>, create one before </html> (or at the end if </html> missing).
        if (/<\/html>/i.test(modifiedHtml)) {
          modifiedHtml = modifiedHtml.replace(/<\/html>/i, `  <head>\n  ${linkTag}\n  </head>\n</html>`);
        } else {
          modifiedHtml = `${modifiedHtml}\n<head>\n  ${linkTag}\n</head>`;
        }
      }
    }

    // Response format: the client can create `Blob`s and trigger downloads.
    res.status(200).json({
      htmlFileName: "converted.html",
      cssFileName,
      htmlContent: modifiedHtml,
      cssContent: extractedCss,
    });
  } catch (err) {
    console.error("fileController.fileDownload error:", err);
    res.status(500).json({ error: "Failed to extract CSS and rewrite HTML." });
  }
};

module.exports = {
  fileDownload,
};
