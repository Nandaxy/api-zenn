require("dotenv").config();

const mongoose = require("mongoose");
const mongoURI = process.env.MONGODB_URI;

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Berhasil terhubung ke MongoDB ✔");
  })
  .catch((error) => {
    console.error("Gagal terhubung ke MongoDB:", error);
  });

module.exports = mongoose;
