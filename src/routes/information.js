const express = require("express");
const { infoTanggalan } = require("../controller/information");
const router = express.Router();

router.get("/info/tanggal/:tahun", infoTanggalan);
router.get("/info/tanggal", infoTanggalan);

module.exports = router;
