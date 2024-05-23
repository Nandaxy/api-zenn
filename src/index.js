const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3333;

const infoRoute = require("./routes/info");
const islamiRoute = require("./routes/islami");
const route = require("./routes/route");

// require('./test/coba.js')

app.use(cors());

// Peroutingan
app.use("/", infoRoute);
app.use("/api", islamiRoute);

// app.use("/", route);

// test halaman utama
app.get("/", async (req, res) => {
  res.json({
    status: true,
    message: "Jalan Bang 😆",
    key: "status, message, data",
  });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
