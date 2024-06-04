const express = require("express");
const {
  getQuoteIslami,
  getSurah,
  getSurahDetail,
  getAyatDetail,
  getKotaJadwal,
  getKotaById,
  getJadwalSholat,
} = require("../controller/islami");
const router = express.Router();

router.get("/islami/random-quote", getQuoteIslami);
router.get("/islami/quran/surah", getSurah);
router.get("/islami/quran/surah/:id", getSurahDetail);
router.get("/islami/quran/surah/:surah/:ayat", getAyatDetail);
router.get("/islami/sholat/kota", getKotaJadwal);
router.get("/islami/sholat/kota/cari/:cari", getKotaJadwal);
router.get("/islami/sholat/kota/:id", getKotaById);
router.get("/islami/sholat/jadwal/:id/:tahun/:bulan", getJadwalSholat);
router.get("/islami/sholat/jadwal/:id/:tahun/:bulan/:tanggal", getJadwalSholat);

module.exports = router;
