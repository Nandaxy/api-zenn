const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment");

const infoTanggalan = async (req, res) => {
  try {
    const { tahun } = req.params;

    if (tahun < 1990) {
      return res.json({ status: false, message: "Data Not Found" });
    }

    const waktu = moment().utcOffset(7);
    const tahunSekarang = waktu.year();
    const tahuns = tahun || tahunSekarang;

    const url = `https://tanggalan.com/${tahuns}`;

    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const hasil = [];

    const namaHari = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];

    $("#main ul").each((i, ul) => {
      const bulanTahun = $(ul).find("a:first-child").text().trim();
      const bulanString = bulanTahun.replace(/\d/g, "");
      const tahun = parseInt(bulanTahun.match(/\d+/)[0]);
      const bulan = i + 1;
      const hari = [];

      $(ul)
        .find("li:nth-child(3) a")
        .each((j, a) => {
          const tanggal = $(a).text().trim();
          const isLibur =
            $(a).attr("style") && $(a).attr("style").includes("color: #f00");

          const bulanIndex = i;
          const date = moment(`${tahun}-${bulan}-${tanggal}`, "YYYY-MM-DD");
          const namaHariString = namaHari[date.day()];
          const hariIni = date.isSame(waktu, 'day');

          hari.push({
            tanggal,
            namaHari: namaHariString,
            isLibur: isLibur || false,
            deskripsiLibur: null,
            hariIni,
          });
        });

      $(ul)
        .find("li:nth-child(4) table tr")
        .each((j, tr) => {
          const tanggalLibur = $(tr).find("td").first().text().trim();
          const deskripsiLibur = $(tr).find("td").last().text().trim();
          const hariLibur = hari.find((h) => h.tanggal === tanggalLibur);

          if (hariLibur) {
            hariLibur.isLibur = true;
            hariLibur.deskripsiLibur = deskripsiLibur;
          }
        });

      hasil.push({ bulan, bulanString, tahun, hari });
    });

    res.json({
      status: true,
      sekarang: waktu.format("YYYY-MM-DD HH:mm:ss"),
      reqTahun: tahuns,
      data: hasil,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = { infoTanggalan };
