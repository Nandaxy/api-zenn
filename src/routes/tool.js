const express = require("express");
const { addCounter, viewCounter } = require("../controller/tool");
const router = express.Router();

router.get("/tool/counter", addCounter);
router.get("/tool/counter/view", viewCounter);

module.exports = router;
