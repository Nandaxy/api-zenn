const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3333;

const infoRoute = require("./routes/info");
const islamiRoute = require("./routes/islami");
const downloaderRoute = require("./routes/downloader");
const aiRoute = require("./routes/ai");
const newsRoute = require("./routes/news");

app.use(cors());

// Peroutingan
app.use("/", infoRoute);
app.use("/api", islamiRoute);
app.use("/api", downloaderRoute);
app.use("/api", aiRoute);
app.use("/api", newsRoute);

// test halaman utama
app.get("/", (req, res) => {
  res.json({
    status: true,
    message: "Jalan Bang 😆",
  });
});

// testing
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
