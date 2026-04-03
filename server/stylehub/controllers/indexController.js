const wakeUp = (req, res) => {
  console.log("indexController.wakeUp called");
  res.send("Ready");
};

module.exports = {
  wakeUp
};  
