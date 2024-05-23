const getQuoteIslami = (req, res) => {
  try {
    const quotes = require("../../data/islami/quote/quote.json");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    res.json({ status: true, data: randomQuote });
  } catch (error) {
    console.error("Error:", error);
    res.json({
      status: false,
      message: "Gagal membaca atau mengurai data quote",
    });
  }
};

module.exports = { getQuoteIslami };
