const axios = require("axios");
const ytdl = require("ytdl-core");
const { ndown } = require("nayan-media-downloader");
const yts = require("yt-search");

const fbDownloader = async url => {
    try {
        if (!url) {
            return {
                status: false,
                message: "Url facebook tidak ada"
            };
        }
        const URL = await ndown(url);
        const data = URL.data;

        if (data === undefined) {
            return {
                status: false,
                message: "Url tidak valid atau server error",
                result: data
            };
        }
        return {
            status: true,
            message: "success",
            result: data
        };
    } catch (error) {
        return {
            status: false,
            message: "Internal server eror"
        };
    }
};

const ytSearch = async query => {
    try {
        if (!query) {
            return {
                status: false,
                message: "masukan query"
            };
        }

        const result = await yts(query);
        return {
            status: true,
            message: "Success!",
            result: result.videos
        };
    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "Internal server Error!"
        };
    }
};

const ytPlay = async query => {
    try {
        if (!query) {
            return {
                status: false,
                message: "Masukkan query"
            };
        }

        const response = await yts(query);
        const videos = response.videos;

        if (videos.length > 0) {
            const topVideo = videos[0];
            const url = topVideo.url;

            const info = await ytdl.getInfo(url);

            const title = info.videoDetails.title;
            const description = info.videoDetails.description;
            const thumbnail = info.videoDetails.thumbnail.thumbnails[3].url;
            const view = info.videoDetails.viewCount;
            const lengthSeconds = info.videoDetails.lengthSeconds;

            // console.log(info.videoDetails);

            const audioFormat = ytdl.chooseFormat(info.formats, {
                filter: "audioonly"
            });

            return {
                status: true,
                result: {
                    title: title,
                    video_url: info.videoDetails.video_url,
                    description: description,
                    view: view,
                    lengthSeconds: lengthSeconds,
                    thumbnail: thumbnail,
                    url: audioFormat.url
                }
            };
        } else {
            return {
                status: false,
                message: "Tidak ada hasil untuk query ini"
            };
        }
    } catch (error) {
        console.error("Error while searching YouTube:", error);
        return {
            status: false,
            message: "Terjadi kesalahan saat mencari YouTube"
        };
    }
};

const ytMp4Downloader = async url => {
    try {
        if (!url) {
            return {
                status: false,
                message: "URL video YouTube tidak diberikan"
            };
        }

        if (!ytdl.validateURL(url)) {
            return {
                status: false,
                message: "URL video YouTube tidak valid"
            };
        }

        const info = await ytdl.getInfo(url);

        const title = info.videoDetails.title;
        const description = info.videoDetails.description;
        const thumbnail = info.videoDetails.thumbnail.thumbnails[3].url;
        const view = info.videoDetails.viewCount;
        const lengthSeconds = info.videoDetails.lengthSeconds;

        const format = ytdl.chooseFormat(info.formats, {
            quality: "highest",
            filter: "videoandaudio"
        });

        return {
            status: true,
            message: "success",
            result: {
                title: title,
                description: description,
                view: view,
                lengthSeconds: lengthSeconds,
                thumbnail: thumbnail,
                url: format.url
            }
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            status: false,
            message: error.message
        };
    }
};

const ytMp3Downloader = async url => {
    try {
        if (!url) {
            return {
                status: false,
                message: "URL video YouTube tidak diberikan"
            };
        }

        if (!ytdl.validateURL(url)) {
            return {
                status: false,
                message: "URL video YouTube tidak valid"
            };
        }

        const info = await ytdl.getInfo(url);

        const title = info.videoDetails.title;
        const description = info.videoDetails.description;
        const thumbnail = info.videoDetails.thumbnail.thumbnails[3].url;
        const view = info.videoDetails.viewCount;
        const lengthSeconds = info.videoDetails.lengthSeconds;

        const audioFormat = ytdl.chooseFormat(info.formats, {
            filter: "audioonly"
        });

        return {
            status: true,
            message: "success",
            result: {
                title: title,
                description: description,
                view: view,
                lengthSeconds: lengthSeconds,
                thumbnail: thumbnail,
                url: audioFormat.url
            }
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            status: false,
            message: error.message
        };
    }
};

const youtubeDownloader = async url => {
    try {
        if (!url) {
            return {
                status: false,
                message: "URL video YouTube tidak diberikan"
            };
        }

        if (!ytdl.validateURL(url)) {
            return {
                status: false,
                message: "URL video YouTube tidak valid"
            };
        }

        const info = await ytdl.getInfo(url);

        const title = info.videoDetails.title;
        const description = info.videoDetails.description;
        const thumbnail = info.videoDetails.thumbnail.thumbnails[3].url;
        const view = info.videoDetails.viewCount;
        const lengthSeconds = info.videoDetails.lengthSeconds;

        const videoFormat = ytdl.chooseFormat(info.formats, {
            quality: "highest",
            filter: "videoandaudio"
        });

        const audioFormat = ytdl.chooseFormat(info.formats, {
            filter: "audioonly"
        });

        return {
            status: true,
            message: "success",
            result: {
                title: title,
                description: description,
                view: view,
                lengthSeconds: lengthSeconds,
                thumbnail: thumbnail,
                videoUrl: videoFormat.url,
                audioUrl: audioFormat.url
            }
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            status: false,
            message: error.message
        };
    }
};

const tiktokDownloader = async url => {
    const clean = data => {
        let regex = /(<([^>]+)>)/gi;
        data = data.replace(/(<br?\s?\/>)/gi, " \n");
        return data.replace(regex, "");
    };

    try {
        if (!url) {
            return {
                status: false,
                message: "Missing TikTok URL"
            };
        }

        // const tiktokUrlRegex = /^https?:\/\/(?:www\.)?(?:vm\.)?tiktok\.com\/[\w-]+\/[\w-]+/i;
        //
        //         if (!tiktokUrlRegex.test(url)) {
        //             return {
        //                 status: false,
        //                 message: "URL tidak valid!"
        //             };
        //         }

        const response = await axios.post(
            "https://lovetik.com/api/ajax/search",
            new URLSearchParams({ query: url })
        );

        // console.log(response);

        if (response.data.mess === "Error: Could not get Video ID.") {
            return {
                status: false,
                message: "Video not found!"
            };
        }

        if (
            response.data.mess ===
            "Video not found. Please enter TikTok video url."
        ) {
            return {
                status: false,
                message: "Url tidak valid!"
            };
        }

        const result = {
            status: true,
            result: {
                title: clean(response.data.desc),
                author: clean(response.data.author),
                nowm: await (response.data.links[0]?.a?.replace(
                    "https",
                    "http"
                ) || ""),
                watermark: await (response.data.links[1]?.a?.replace(
                    "https",
                    "http"
                ) || ""),
                audio: await (response.data.links[2]?.a?.replace(
                    "https",
                    "http"
                ) || ""),
                thumbnail: await response.data.cover
            }
        };

        return result;
    } catch (error) {
        // console.error("Error processing TikTok request:", error);
        return {
            status: false,
            result: {
                error: "Internal server error",
                message: "Gak tau 😂"
            }
        };
    }
};

module.exports = {
    ytMp4Downloader,
    ytMp3Downloader,
    youtubeDownloader,
    tiktokDownloader,
    fbDownloader,
    ytSearch,
    ytPlay
};
