const fs = require("fs");
const path = require("path");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

const url = "https://jadwalsholat.org/jadwal-sholat/default.php";

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

  if (id < 1 || id > 114) {
    return res.json({
      status: false,
      message: "Not found",
      data: null,
    });
  }
  try {
    const data = require(`../../data/islami/quran/surah/${id}.json`, "utf8");
    res.json({ status: true, data });
  } catch (error) {
    res.json({ status: false, message: "Internal server error", data: null });
  }
};

const getAyatDetail = async (req, res) => {
  const { surah, ayat } = req.params;

  try {
    const filePath = path.resolve(
      __dirname,
      `../../data/islami/quran/surah/${surah}.json`
    );
    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

    const [startAyat, endAyat] = ayat.split("-").map((num) => parseInt(num));

    if (isNaN(startAyat) || (endAyat && isNaN(endAyat))) {
      return res.status(400).json({
        status: false,
        message: "Invalid ayat parameter",
        data: null,
      });
    }

    if (
      startAyat < 1 ||
      startAyat > data.number_of_ayah ||
      (endAyat && (endAyat < startAyat || endAyat > data.number_of_ayah))
    ) {
      return res.status(400).json({
        status: false,
        message: "Requested ayat range is out of bounds",
        data: null,
      });
    }

    const ayatDetails = data.verses.filter((v) => {
      if (endAyat) {
        return v.number >= startAyat && v.number <= endAyat;
      }
      return v.number === startAyat;
    });

    if (ayatDetails.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Ayat not found",
        data: null,
      });
    }

    res.json({
      status: true,
      data: {
        surah: data.name,
        name_translations: data.name_translations,
        number_of_ayah: data.number_of_ayah,
        number_of_surah: data.number_of_surah,
        place: data.place,
        verses: ayatDetails,
      },
    });
  } catch (error) {
    console.error("Error reading surah data:", error);
    res.status(500).json({
      status: false,
      message: "Internal server error",
      data: null,
    });
  }
};

const getKotaJadwal = async (req, res) => {
  const { cari } = req.params;

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const result = [];

    $('select[name="kota"] option').each((index, element) => {
      const namaKota = $(element).text().trim();
      const idKota = $(element).attr("value");

      result.push({ id: idKota, lokasi: namaKota });
    });

    if (cari) {
      console.log(cari);
      const filteredResult = result.filter((kota) =>
        kota.lokasi.toLowerCase().includes(cari.toLowerCase())
      );

      if (filteredResult.length === 0) {
        return res.json({
          status: false,
          message: "City not found",
        });
      }

      return res.json({ status: true, data: filteredResult });
    }

    res.json({ status: true, data: result });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", data: null });
  }
};

const getKotaById = async (req, res) => {
  const { id } = req.params;

  try {
    if (isNaN(id)) {
      return res.json({
        status: false,
        message: "ID tidak valid",
      });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const result = [];

    $('select[name="kota"] option').each((index, element) => {
      const namaKota = $(element).text().trim();
      const idKota = $(element).attr("value");

      result.push({ id: idKota, name: namaKota });
    });

    const kotaById = result.find((kota) => kota.id === id);

    if (!kotaById) {
      return res.json({
        status: false,
        message: "City not found",
      });
    }

    res.json({ status: true, data: kotaById });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: false, message: "Internal server error", data: null });
  }
}

const getJadwalSholat = async (req, res) => {
  try {
    const { id, tahun, bulan, tanggal } = req.params;
    const url = `https://jadwalsholat.org/jadwal-sholat/monthly.php?id=${id}&m=${bulan}&y=${tahun}`;
    console.log(url);

    if (bulan > 12) {
      return res.json({
        status: false,
        message: "Hanya ada 12 bulan dalam setahun",
      });
    }

    if (bulan < 1 || isNaN(bulan)) {
      return res.json({
        status: false,
        message: "Bulan tidak valid",
      });
    }

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const result = [];

    const lokasi = $("h1.h1_edit")
      .text()
      .split(" untuk ")[1]
      .split(",")[0]
      .trim();

    if (!lokasi) {
      return res.json({
        status: false,
        message: "ID tidak valid / lokasi tidak ditemukan",
      });
    }

    $("table.table_adzan tbody tr").each((index, element) => {
      if (
        index === 0 ||
        $(element).hasClass("table_title") ||
        $(element).hasClass("table_header") ||
        $(element).hasClass("table_block_title") ||
        $(element).hasClass("table_block_content")
      ) {
        return;
      }

      const imsyak = $(element).find("td:nth-child(2)").text().trim();
      const shubuh = $(element).find("td:nth-child(3)").text().trim();
      const terbit = $(element).find("td:nth-child(4)").text().trim();
      const dhuha = $(element).find("td:nth-child(5)").text().trim();
      const dzuhur = $(element).find("td:nth-child(6)").text().trim();
      const ashar = $(element).find("td:nth-child(7)").text().trim();
      const maghrib = $(element).find("td:nth-child(8)").text().trim();
      const isya = $(element).find("td:nth-child(9)").text().trim();

      const date = $(element).find("td:nth-child(1)").text();
      const formattedDate = `${tahun}-${bulan}-${date.padStart(2, "0")}`;
      const tanggalFormatted = moment(formattedDate, "YYYY-MM-DD")
        .locale("id")
        .format("dddd, DD/MM/YYYY");

      if (
        tanggalFormatted &&
        imsyak &&
        shubuh &&
        terbit &&
        dhuha &&
        dzuhur &&
        ashar &&
        maghrib &&
        isya
      ) {
        result.push({
          tanggal: tanggalFormatted,
          imsyak,
          shubuh,
          terbit,
          dhuha,
          dzuhur,
          ashar,
          maghrib,
          isya,
          date: formattedDate,
        });
      }
    });

    if (tanggal) {
      const requestedDate = moment(`${tahun}-${bulan}-${tanggal.padStart(2, "0")}`, "YYYY-MM-DD").format("YYYY-MM-DD");
      const jadwalHarian = result.find(j => j.date === requestedDate);
      if (jadwalHarian) {
        return res.json({
          status: true,
          data: { id, tahun, bulan, tanggal, lokasi, jadwal: jadwalHarian },
        });
      } else {
        return res.json({
          status: false,
          message: "Data tidak ditemukan untuk tanggal yang diminta",
        });
      }
    }

    res.json({
      status: true,
      data: { id, tahun, bulan, lokasi, jadwal: result },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error", data: null });
  }
};


module.exports = {
  getQuoteIslami,
  getSurah,
  getSurahDetail,
  getAyatDetail,
  getKotaJadwal,
  getKotaById,
  getJadwalSholat,
};
