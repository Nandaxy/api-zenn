const axios = require("axios");
const cheerio = require("cheerio");

const infoTanggalan = async (req, res) => {
    try {
        const { tahun } = req.params;
        const waktu = new Date();
        const tahunSekarang = waktu.getFullYear();
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
            "Sabtu"
        ];

        $("#main ul").each((i, ul) => {
            const bulanTahun = $(ul).find("a:first-child").text().trim();
            const bulanString = bulanTahun.replace(/\d/g, ""); // Menghapus tahun dari nama bulan
            const tahun = parseInt(bulanTahun.match(/\d+/)[0]); // Mendapatkan tahun dari nama bulan
            const bulan = i + 1; // Penambahan 1 karena index bulan dimulai dari 0
            const hari = [];

            // Ambil hari
            $(ul)
                .find("li:nth-child(3) a")
                .each((j, a) => {
                    const tanggal = $(a).text().trim();
                    const isLibur =
                        $(a).attr("style") &&
                        $(a).attr("style").includes("color: #f00");

                    // Menentukan nama hari berdasarkan tanggal dan bulan
                    const bulanIndex = i; // i di sini merupakan index bulan dari 0-11
                    const date = new Date(tahun, bulanIndex, parseInt(tanggal));
                    const namaHariString = namaHari[date.getDay()];
                    const hariIni =
                        date.toDateString() === waktu.toDateString(); // Memeriksa apakah hari ini

                    hari.push({
                        tanggal,
                        namaHari: namaHariString,
                        isLibur: isLibur || false,
                        deskripsiLibur: null,
                        hariIni // Tambahkan properti hariIni
                    });
                });

            // Ambil libur dan tambahkan deskripsi ke objek hari yang sesuai
            $(ul)
                .find("li:nth-child(4) table tr")
                .each((j, tr) => {
                    const tanggalLibur = $(tr).find("td").first().text().trim();
                    const deskripsiLibur = $(tr)
                        .find("td")
                        .last()
                        .text()
                        .trim();
                    const hariLibur = hari.find(
                        h => h.tanggal === tanggalLibur
                    );

                    if (hariLibur) {
                        hariLibur.isLibur = true;
                        hariLibur.deskripsiLibur = deskripsiLibur;
                    }
                });

            

            hasil.push({ bulan, bulanString, tahun, hari });
        });

        res.json({
            status: true,
            sekarang: waktu.toDateString(),
            tahun: tahuns,
            data: hasil
        });
    } catch (error) {
        console.error(error);
        res.json({ status: false, message: "Kesalahan server internal" });
    }
};

module.exports = { infoTanggalan };
