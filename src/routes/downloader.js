const express = require("express");
const {
  ytSearch,
  ytPlay,
  ytMp4Downloader,
  ytMp3Downloader,
  youtubeDownloader,
  tiktokDownloader,
} = require("../controller/downloader");
const router = express.Router();

router.get("/downloader/ytsearch", ytSearch);
router.get("/downloader/play", ytPlay);
router.get("/downloader/ytmp4", ytMp4Downloader);
router.get("/downloader/ytmp3", ytMp3Downloader);
router.get("/downloader/yt", youtubeDownloader);
router.get("/downloader/tiktok", tiktokDownloader);

module.exports = router;
