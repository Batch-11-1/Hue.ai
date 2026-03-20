const { Router } = require("express");
const adjustController = require("../controllers/adjustController");
const fileController = require("../controllers/fileController");
const inputController = require("../controllers/inputController");
const outputController = require("../controllers/outputController");
const indexController = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", indexController.wakeUp);
indexRouter.post("/initiate", inputController.initiatePrompt);
indexRouter.post("/preview", outputController.previewBuild);
indexRouter.post("/adjust", adjustController.adjustPrompt);
indexRouter.post("/file", fileController.fileDownload);
indexRouter.post("/repeat", inputController.repeatPrompt);
indexRouter.get("/reset", indexController.resetPrompt);

module.exports = indexRouter;