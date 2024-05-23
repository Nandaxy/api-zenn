const { gpt, pintarest, imagine } = require("nayan-server");

const openAiGpt = async (text) => {
  if (!text) {
    return {
      status: false,
      message: "Isi parameter text",
    };
  }

  try {
    return new Promise((resolve, reject) => {
      gpt(
        {
          messages: [
            {
              role: "assistant",
              content: "Hello! How are you today?",
            },
            {
              role: "user",
              content: "Hello, my name is Nanda",
            },
            {
              role: "assistant",
              content: "Hello, Nanda! How are you today?",
            },
          ],
          prompt: text,
          model: "GPT-4",
          markdown: false,
        },
        (err, data) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            const result = {
              status: true,
              model: data.Model,
              prompt: text,
              result: data.gpt,
            };
            resolve(result);
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
    return { status: false, message: "Error" };
  }
};

const searchPinterest = async (query) => {
  if (!query) {
    return {
      status: false,
      message: "Isi parameter query",
    };
  }

  try {
    const search = query;
    console.log(search);
    const data = await pintarest(search);
    return {
      status: true,
      result: {
        count: data.count,
        data: data.data,
      },
    };
  } catch (error) {
    console.error("Terjadi kesalahan saat mencari Pinterest", error);
    return {
      status: false,
      message: "Terjadi kesalahan saat mencari Pinterest",
      error: error.message,
    };
  }
};

const aiImageCreator = async (text) => {
  if (!text) {
    return {
      status: false,
      message: "Isi parameter text",
    };
  }

  try {
    const promt = text;
    const data = await imagine(promt);
    // console.log(data);
    return {
      status: true,
      result: {
        requestId: data.job_id,
        url: data.image_url,
      },
    };
  } catch (error) {
    console.error("Terjadi kesalahan saat mencari Pinterest", error);
    return {
      status: false,
      message: "Terjadi kesalahan saat mencari Pinterest",
      error: error.message,
    };
  }
};

module.exports = {
  openAiGpt,
  searchPinterest,
  aiImageCreator,
};
