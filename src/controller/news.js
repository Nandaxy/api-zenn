const axios = require("axios");
const cheerio = require("cheerio");

const infoGempa = async (req, res) => {
    try {
        const { data, status } = await axios.get(
            "https://www.bmkg.go.id/gempabumi/gempabumi-dirasakan.bmkg"
        );
        const $ = cheerio.load(data);
        const hasil = [];

        $("table.table-hover.table-striped > tbody > tr").each((i, u) => {
            let posisi = $(u).find("td:nth-child(3)").text().split(" ");
            let map = $(u)
                .find("td:nth-child(6) > a")
                .attr("data-target")
                .replace()
                .replace(/#/g, "");
            let wilayah_data = $(u).find("td:nth-child(6) > div").html();
            let wilayah = wilayah_data
                .match(/<span class="label label-warning">(.*?)<\/span>/g)
                .map(wilayah_data =>
                    wilayah_data
                        .replace(/<\/?span.*?>/g, "")
                        .replace(/\t/g, " ")
                );

            hasil.push({
                index: $(u).find("td:nth-child(1)").text(),
                waktu: $(u)
                    .find("td:nth-child(2)")
                    .html()
                    .replace(/<br>/g, " "),
                lintang: `${posisi[0]} ${posisi[1]}`,
                bujur: `${posisi[2]} ${posisi[3]}`,
                magnitudo: $(u).find("td:nth-child(4)").text(),
                kedalaman: $(u).find("td:nth-child(5)").text(),
                wilayah: $(u).find("td:nth-child(6) > a").text(),
                wilayah_dirasakan: wilayah,
                img_map: `https://ews.bmkg.go.id/TEWS/data/${map}.mmi.jpg`,
                google_map: `https://www.google.com/maps/place/${posisi[0]}%C2%B0S+${posisi[2]}%C2%B0E`
            });
        });

        return res.json({ status: true, data: hasil });
    } catch (err) {
        res.json({ status: false, message: "Internal server error" });
    }
};

module.exports = { infoGempa };
