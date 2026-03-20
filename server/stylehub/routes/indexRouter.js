const { Router } = require("express");
const adjustController = require("../controllers/adjustController");
const fileController = require("../controllers/fileController");
const inputController = require("../controllers/inputController");
const outputController = require("../controllers/outputController");
const wakeController = require("../controllers/wakeController");

const indexRouter = Router();

indexRouter.get("/", wakeController.wakeUp);
indexRouter.post("/initiate", inputController.initiatePrompt);
indexRouter.get("/preview", outputController.showOutput);
indexRouter.post("/adjust", adjustController.adjust);
indexRouter.get("/file", fileController.fileDownload);
indexRouter.post("/repeat", inputController.repeatStyle);

module.exports = indexRouter;