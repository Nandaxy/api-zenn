const ytdl = require("ytdl-core");
const yts = require("yt-search");
const { default: axios } = require("axios");

const ytSearch = async (req, res) => {
  const query = req.query.q;
  try {
    if (!query) {
      res.json({
        status: false,
        message: "masukan query",
      });
      return;
    }

    const result = await yts(query);
    res.json({
      status: true,
      data: result.videos,
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Internal server Error!",
    });
  }
};

const ytPlay = async (req, res) => {
  const query = req.query.q;
  try {
    if (!query) {
      res.json({
        status: false,
        message: "masukan query",
      });
      return;
    }

    const response = await yts(query);
    const videos = response.videos;

    if (videos.length > 0) {
      const topVideo = videos[0];
      const url = topVideo.url;
      const info = await ytdl.getInfo(url);

      const audioFormat = ytdl.chooseFormat(info.formats, {
        filter: "audioonly",
      });

      res.json({
        status: true,
        data: {
          title: info.videoDetails.title,
          video_url: info.videoDetails.video_url,
          lengthSeconds: info.videoDetails.lengthSeconds,
          view: info.videoDetails.viewCount,
          uploadDate: info.videoDetails.publishDate,
          description: info.videoDetails.description,
          thumbnail:
            info.videoDetails.thumbnails[
              info.videoDetails.thumbnails.length - 1
            ].url,
          url: audioFormat.url,
          Channel: info.videoDetails.author,
        },
      });
    } else {
      res.json({
        status: false,
        message: "Data not found",
        data: null,
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "Internal server Error!",
    });
  }
};

const ytMp4Downloader = async (req, res) => {
  const url = req.query.url;
  try {
    if (!url) {
      res.json({ status: false, message: "Masukan url nya!" });
      return;
    }

    if (!ytdl.validateURL(url)) {
      res.json({ status: false, message: "URL video YouTube tidak valid" });
      return;
    }

    const info = await ytdl.getInfo(url);
    const video = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: "videoandaudio",
    });

    res.json({
      status: true,
      data: {
        title: info.videoDetails.title,
        video_url: info.videoDetails.video_url,
        lengthSeconds: info.videoDetails.lengthSeconds,
        view: info.videoDetails.viewCount,
        uploadDate: info.videoDetails.publishDate,
        description: info.videoDetails.description,
        thumbnail:
          info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
            .url,
        url: video.url,
        Channel: info.videoDetails.author,
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: "Internal server Error!",
    });
  }
};

const ytMp3Downloader = async (req, res) => {
  const url = req.query.url;
  try {
    if (!url) {
      res.json({ status: false, message: "Masukan url nya!" });
      return;
    }

    if (!ytdl.validateURL(url)) {
      res.json({ status: false, message: "URL video YouTube tidak valid" });
      return;
    }

    const info = await ytdl.getInfo(url);
    const audio = ytdl.chooseFormat(info.formats, {
      filter: "audioonly",
    });

    res.json({
      status: true,
      data: {
        title: info.videoDetails.title,
        video_url: info.videoDetails.video_url,
        lengthSeconds: info.videoDetails.lengthSeconds,
        view: info.videoDetails.viewCount,
        uploadDate: info.videoDetails.publishDate,
        description: info.videoDetails.description,
        thumbnail:
          info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
            .url,
        url: audio.url,
        Channel: info.videoDetails.author,
      },
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Internal server Error!",
    });
  }
};

const youtubeDownloader = async (req, res) => {
  const url = req.query.url;
  try {
    if (!url) {
      res.json({ status: false, message: "Masukan url nya!" });
      return;
    }

    if (!ytdl.validateURL(url)) {
      res.json({ status: false, message: "URL video YouTube tidak valid" });
      return;
    }

    const info = await ytdl.getInfo(url);
    const video = ytdl.chooseFormat(info.formats, {
      quality: "highest",
      filter: "videoandaudio",
    });
    const audio = ytdl.chooseFormat(info.formats, {
      filter: "audioonly",
    });

    res.json({
      status: true,
      data: {
        title: info.videoDetails.title,
        video_url: info.videoDetails.video_url,
        lengthSeconds: info.videoDetails.lengthSeconds,
        view: info.videoDetails.viewCount,
        uploadDate: info.videoDetails.publishDate,
        description: info.videoDetails.description,
        thumbnail:
          info.videoDetails.thumbnails[info.videoDetails.thumbnails.length - 1]
            .url,
        audioUrl: audio.url,
        videoUrl: video.url,
        Channel: info.videoDetails.author,
      },
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Internal server Error!",
    });
  }
};

const tiktokDownloader = async (req, res) => {
  const url = req.query.url;
  const clean = (data) => {
    let regex = /(<([^>]+)>)/gi;
    data = data.replace(/(<br?\s?\/>)/gi, " \n");
    return data.replace(regex, "");
  };

  try {
    if (!url) {
      res.json({
        status: false,
        message: "Missing url tiktok",
      });
      return;
    }

    const response = await axios.post(
      "https://lovetik.com/api/ajax/search",
      new URLSearchParams({ query: url })
    );

    console.log(response);

    if (response.data.mess === "Error: Could not get Video ID.") {
      res.json({
        status: false,
        message: "Video not found!",
      });
      return;
    }

    if (
      response.data.mess === "Video not found. Please enter TikTok video url."
    ) {
      res.json({
        status: false,
        message: "Url tidak valid!",
      });
      return;
    }

    res.json({  status: true,
        data: {
          title: clean(response.data.desc),
          author: clean(response.data.author),
          nowm: await (response.data.links[0]?.a?.replace("https", "http") || ""),
          watermark: await (response.data.links[1]?.a?.replace("https", "http") ||
            ""),
          audio: await (response.data.links[2]?.a?.replace("https", "http") ||
            ""),
          thumbnail: await response.data.cover,
        }, });
  } catch (error) {
    console.error("Error processing TikTok request:", error);
    res.json({
      status: false,
      message: "Internal server error!",
    });
  }
};

module.exports = {
  ytSearch,
  ytPlay,
  ytMp4Downloader,
  ytMp3Downloader,
  youtubeDownloader,
  tiktokDownloader,
};
