const express = require("express");
const router = express.Router();

const {
    getKotaJadwalSholat,
    getJadwalSholat,
    getSurah,
    getSurahDetail,
    getQuoteIslami
} = require("../lib/islami.js");
const {
    ytMp4Downloader,
    ytMp3Downloader,
    youtubeDownloader,
    tiktokDownloader,
    fbDownloader,
    ytSearch,
    ytPlay
} = require("../lib/downloader.js");
const {
    openAiGpt,
    searchPinterest,
    aiImageCreator
} = require("../lib/nayan-server.js");
const {
    getListName,
    randomJsonAnime,
    randomAnime
} = require("../lib/random-image-anime-json.js");


// Islami
router.get("/api/islami/kota-jadwal-sholat", async (req, res) => {
    const result = await getKotaJadwalSholat();
    res.json(result);
});

router.get("/api/islami/jadwal-sholat", async (req, res) => {
    const kota = req.query.kota;
    const bulan = req.query.bulan;
    const result = await getJadwalSholat(kota, bulan);
    res.json(result);
});

router.get("/api/islami/quran/surah", async (req, res) => {
    const result = await getSurah();
    res.json(result);
});

router.get("/api/islami/quran/surah/:id", async (req, res) => {
    const { id } = req.params;
    const result = await getSurahDetail(id);
    res.json(result);
});

router.get("/api/islami/random-qoute", async (req, res) => {
    const result = await getQuoteIslami();
    res.json(result);
});
// Downloader
router.get("/downloader/ytmp4", async (req, res) => {
    const url = req.query.url;
    const result = await ytMp4Downloader(url);
    res.json(result);
});

router.get("/downloader/yt", async (req, res) => {
    const url = req.query.url;
    const result = await youtubeDownloader(url);
    res.json(result);
});

router.get("/downloader/ytmp3", async (req, res) => {
    const url = req.query.url;
    const result = await ytMp3Downloader(url);
    res.json(result);
});

router.get("/downloader/play", async (req, res) => {
    const query = req.query.query;
    const result = await ytPlay(query);
    res.json(result);
});

router.get("/downloader/yt-search", async (req, res) => {
    const query = req.query.query;
    const result = await ytSearch(query);
    res.json(result);
});

router.get("/downloader/tiktok", async (req, res) => {
    const url = req.query.url;
    const result = await tiktokDownloader(url);
    res.json(result);
});

router.get("/downloader/fb", async (req, res) => {
    const url = req.query.url;
    const result = await fbDownloader(url);
    res.json(result);
});

router.get("/downloader/ig", async (req, res) => {
    const url = req.query.url;
    const result = await fbDownloader(url);
    res.json(result);
});


// nayan server
router.get("/ai/gpt", async (req, res) => {
    const text = req.query.text;
    const result = await openAiGpt(text);
    res.json(result);
});

router.get("/ai/image", async (req, res) => {
    const text = req.query.text;
    const result = await aiImageCreator(text);
    res.json(result);
});

router.get("/search/pinterest", async (req, res) => {
    const query = req.query.query;
    const result = await searchPinterest(query);
    res.json(result);
});

// random image
router.get("/random-image/list-anime", async (req, res) => {
    const result = await getListName();
    res.json(result);
});

router.get("/random-image/anime/json/:name", async (req, res) => {
    const name = req.params.name;
    const result = await randomJsonAnime(name);
    res.json(result);
});

router.get("/random-image/anime/:name", async (req, res) => {
    const name = req.params.name;
    const result = await randomAnime(name);
    res.setHeader("Content-Type", "image/jpeg");
    res.send(result);
});

module.exports = router;
