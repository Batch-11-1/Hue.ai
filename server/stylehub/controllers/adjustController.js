/* the req.body contains the html file uploaded by the user and a suggestion.

prompt example: "Suggestion: Make the background color of the header blue. HTML file: <html><head></head><body><header>Header</header></body></html>"

Use axios to send the prompt to the AI model, mention to respond with the css added internally in the html file and receive the generated html-CSS code.
Send the huggingface API token in the request header for authentication as an environment variable.

Finally, send the generated code back to the client as a response.
*/
const adjustPrompt = (req, res) => {
  console.log("adjustController.adjustPrompt called");
  res.send("adjustPrompt placeholder");
};

module.exports = {
  adjustPrompt,
};
