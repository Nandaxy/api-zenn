require("dotenv").config();

const mongoose = require("mongoose");
const mongoURI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Conn:Mvzis4kA0Bf0dVHd@cluster0.08pcdmx.mongodb.net/api-zenn?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Berhasil terhubung ke MongoDB ✔");
  })
  .catch((error) => {
    console.error("Gagal terhubung ke MongoDB:", error);
  });

module.exports = mongoose;
