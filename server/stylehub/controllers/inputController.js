const initiatePrompt = (req, res) => {
  console.log("inputController.initiatePrompt called");
  res.send("initiatePrompt placeholder");
};

const repeatPrompt = (req, res) => {
  console.log("inputController.repeatPrompt called");
  res.send("repeatPrompt placeholder");
};

module.exports = {
  initiatePrompt,
  repeatPrompt,
};
