/* the req.body contatins two html files already styled and the user input to repeat the styling of one file to the other.

prompt example: "Repeat the styling of file1.html to file2.html, only change the content but keep the same structure and styling. Respond with the new html file with the css added internally in the html file."

Use axios to send the prompt to the AI model, mention to respond with the css added internally in the html file and receive the generated html-CSS code.
Send the huggingface API token in the request header for authentication as an environment variable.

Finally, send the generated code back to the client as a response.
*/
const repeatPrompt = (req, res) => {
  console.log("repeatController.repeatPrompt called");
  res.send("repeatPrompt placeholder");
};
module.exports = {
  repeatPrompt,
};
