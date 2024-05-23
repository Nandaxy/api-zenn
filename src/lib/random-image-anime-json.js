const fs = require("fs");
const path = require("path");
const axios = require("axios");

const listName = [
    {
        name: "gojo",
        jsonFileName: "gojo-satoru.json"
    },
    {
        name: "hutao",
        jsonFileName: "hutao.json"
    },
    {
        name: "alya",
        jsonFileName: "alya-san.json"
    },
    {
        name: "elaina",
        jsonFileName: "elaina.json"
    },
    {
        name: "furina",
        jsonFileName: "furina.json"
    },
    {
        name: "bocchi",
        jsonFileName: "hitori-goto.json"
    },
    {
        name: "hoshino",
        jsonFileName: "hoshino-blue-archive.json"
    },
    {
        name: "keqing",
        jsonFileName: "keqing.json"
    },
    {
        name: "kita",
        jsonFileName: "kita-ikuyo.json"
    },
    {
        name: "nahida",
        jsonFileName: "nahida.json"
    },
    {
        name: "nijika",
        jsonFileName: "nijika-ijichi.json"
    },
    {
        name: "ryo",
        jsonFileName: "ryo-yamada.json"
    },
    {
        name: "sakuna",
        jsonFileName: "sakuna-jujutsu.json"
    },
    {
        name: "sasuke",
        jsonFileName: "sasuke.json"
    },
    {
        name: "sparkle",
        jsonFileName: "sparkle-hsr.json"
    },
    {
        name: "yuuka",
        jsonFileName: "yuuka-blue-archive.json"
    }
];

const getListName = () => {
    try {
        const names = listName.map(item => item.name);
        // console.log(names);
        return {
            status: true,
            result: names
        };
    } catch (error) {
        return {
            status: false,
            message: "Server error!"
        };
        console.log(error);
    }
};

const randomJsonAnime = async name => {
    try {
        const matchedItem = listName.find(
            item => item.name.toLowerCase() === name.toLowerCase()
        );

        if (!matchedItem) {
            return {
                status: false,
                message: `Tidak ada data gambar untuk: '${name}'`
            };
        }

        const jsonFilePath = path.join(
            __dirname,
            "../data/image/anime",
            matchedItem.jsonFileName
        );

        const jsonData = fs.readFileSync(jsonFilePath, "utf8");

        const parsedData = JSON.parse(jsonData);

        const randomIndex = Math.floor(Math.random() * parsedData.length);
        const randomData = parsedData[randomIndex];

        return {
            status: true,
            message: "succes",
            result: randomData
        };
    } catch (error) {
        console.log("Terjadi kesalahan dalam randomJsonAnime:", error);
        return {
            status: false,
            message: "Internal server error!"
        };
    }
};

const randomAnime = async name => {
    try {
        const checkRandom = await randomJsonAnime(name);
        const randomImageUrl = checkRandom;
        console.log(randomImageUrl.status);
        if (!randomImageUrl.status) {
            return {
                status: false,
                message: randomImageUrl.message
            };
        }
        const imageUrl = randomImageUrl.result;
        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer"
        });

        return response.data;
    } catch (error) {
        console.error(error);
        return {
            status: false,
            message: "server error"
        };
    }
};

module.exports = {
    getListName,
    randomJsonAnime,
    randomAnime
};
