/*
 * indexRouter.js
 * Definition map for API routes matching endpoints to their required controllers.
 */
const { Router } = require("express");
const adjustController = require("../controllers/adjustController");
const fileController = require("../controllers/fileController");
const inputController = require("../controllers/inputController");
const indexController = require("../controllers/indexController");
const repeatController = require("../controllers/repeatController");

const indexRouter = Router();

indexRouter.get("/wake", indexController.wakeUp);
indexRouter.post("/initiate", inputController.initiatePrompt);
indexRouter.post("/adjust", adjustController.adjustPrompt);
indexRouter.post("/file", fileController.fileDownload);
indexRouter.post("/repeat", repeatController.repeatPrompt);

module.exports = indexRouter;