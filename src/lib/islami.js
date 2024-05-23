const axios = require("axios");
const fs = require("fs");

const getKotaJadwalSholat = async () => {
  try {
    const response = await axios.get(
      "https://api.github.com/repos/lakuapik/jadwalsholatorg/contents/adzan"
    );
    const data = response.data.map((item) => item.name);
    return {
      status: true,
      result: data,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      status: "error",
      message: "Gagal mendapatkan data jadwal sholat",
    };
  }
};

const getJadwalSholat = async (kota, bulan) => {
  try {
    if (!kota) {
      return {
        status: false,
        message: 'Parameter "kota" harus diberikan',
      };
    }

    kota = kota.toLowerCase();

    const now = new Date();
    let tahun = now.getFullYear();

    if (!bulan) {
      bulan = ("0" + (now.getMonth() + 1)).slice(-2);
    } else if (bulan.length === 1) {
      bulan = "0" + bulan;
    }

    const url = `https://raw.githubusercontent.com/lakuapik/jadwalsholatorg/master/adzan/${kota}/${tahun}/${bulan}.json`;

    try {
      const response = await axios.get(url);
      const data = response.data;
      return {
        status: true,
        result: data,
      };
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return {
          status: false,
          message: "Data jadwal sholat tidak tersedia untuk kota dan bulan ini",
        };
      } else {
        console.error("Error fetching data:", error);
        return {
          status: false,
          message: "Gagal mendapatkan data jadwal sholat",
        };
      }
    }
  } catch (error) {
    console.error("Error:", error);
    return {
      status: false,
      message: "Terjadi kesalahan dalam menangani permintaan",
    };
  }
};

const getSurah = () => {
  return new Promise((resolve, reject) => {
    try {
      const data = fs.readFileSync("./data/islami/quran/quran.json", "utf8");
      const surahData = JSON.parse(data);
      resolve({
        status: true,
        result: surahData,
      });
    } catch (error) {
      console.error("Error reading file:", error);
      reject({
        status: false,
        message: "Gagal membaca data surah",
      });
    }
  });
};

const getSurahDetail = async (id) => {
  try {
    const data = await fs.promises.readFile(
      `./data/islami/quran/surah/${id}.json`,
      "utf8"
    );
    const surahDetail = JSON.parse(data);
    return {
      status: true,
      result: surahDetail,
    };
  } catch (error) {
    console.error("Error reading file:", error);
    return {
      status: false,
      message: "Gagal membaca data surah",
    };
  }
};

const getQuoteIslami = () => {
  try {
    const quotes = require("../../data/islami/quote/quote.json");
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    return Promise.resolve({
      status: true,
      result: randomQuote,
    });
  } catch (error) {
    console.error("Error:", error);
    return Promise.reject({
      status: false,
      message: "Gagal membaca atau mengurai data quote",
    });
  }
};

module.exports = {
  getKotaJadwalSholat,
  getJadwalSholat,
  getSurah,
  getSurahDetail,
  getQuoteIslami,
};
