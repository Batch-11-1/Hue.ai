/*
 * indexController.js
 * Simple controller to handle initial backend load request and confirm it is awake.
 */
const wakeUp = (req, res) => {
  console.log("indexController.wakeUp called");
  res.send("Ready");
};

module.exports = {
  wakeUp
};  
