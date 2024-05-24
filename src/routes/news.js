const express = require("express");
const { infoGempa } = require("../controller/news");
const router = express.Router();

router.get("/news/gempa", infoGempa);

module.exports = router;
