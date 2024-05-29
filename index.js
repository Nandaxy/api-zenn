const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3333;

require("./src/libs/db");

const infoRoute = require("./src/routes/info");
const islamiRoute = require("./src/routes/islami");
const downloaderRoute = require("./src/routes/downloader");
const toolRoute = require("./src/routes/tool");
const aiRoute = require("./src/routes/ai");
const newsRoute = require("./src/routes/news");

app.use(cors());

// Peroutingan
app.use("/", infoRoute);
app.use("/api", islamiRoute);
app.use("/api", downloaderRoute);
app.use("/api", toolRoute);
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
