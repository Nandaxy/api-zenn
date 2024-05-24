const { getGroqChatCompletion } = require("../libs/groqAi");

const groqAi = async (req, res) => {
  const message = req.query.q;

  if (!message) {
    return res.json({
      status: false,
      message: "Message query parameter is required",
    });
  }

  try {
    const chatCompletion = await getGroqChatCompletion(message);
    res.json({
      status: true,
      data: chatCompletion,
    });
  } catch (error) {
    res.json({
      status: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  groqAi,
};
