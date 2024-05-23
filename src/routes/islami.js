const express = require("express");
const { getQuoteIslami } = require("../controller/islami");
const router = express.Router();

router.get("/islami/random-qoute", getQuoteIslami);

module.exports = router;
