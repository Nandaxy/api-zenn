const express = require("express");
const { getQuoteIslami, getSurah, getSurahDetail } = require("../controller/islami");
const router = express.Router();

router.get("/islami/random-qoute", getQuoteIslami);
router.get("/islami/quran/surah", getSurah);
router.get("/islami/quran/surah/:id", getSurahDetail);

module.exports = router;
