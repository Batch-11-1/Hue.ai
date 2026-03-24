const wakeUp = (req, res) => {
  console.log("indexController.wakeUp called");
  res.send("wakeUp placeholder");
};

const resetPrompt = (req, res) => {
  console.log("indexController.resetPrompt called");
  res.send("resetPrompt placeholder");
};

module.exports = {
  wakeUp,
  resetPrompt,
};
