const fs = require("fs");

const getQuoteIslami = (req, res) => {
  try {
    const quotes = require("../../data/islami/quote/quote.json");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    res.json({ status: true, data: randomQuote });
  } catch (error) {
    res.json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};

const getSurah = (req, res) => {
  try {
    const data = require("../../data/islami/quran/quran.json", "utf8");
    res.json({ status: true, data });
  } catch (error) {
    res.json({ status: false, message: "Internal server error", data: null });
  }
};

const getSurahDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const data = require(`../../data/islami/quran/surah/${id}.json`, "utf8");
    res.json({ status: true, data });
  } catch (error) {
    res.json({ status: false, message: "Internal server error", data: null });
  }
};

module.exports = { getQuoteIslami, getSurah, getSurahDetail };
