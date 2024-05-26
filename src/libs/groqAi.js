require("dotenv").config();
const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey:
    process.env.GROQ_API_KEY ||
    "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",
});

const getGroqChatCompletion = async (message) => {
  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama3-8b-8192",
    });
    return response.choices[0]?.message?.content || "No response from Groq AI";
  } catch (error) {
    console.error("Error getting chat completion:", error);
  }
};

module.exports = { getGroqChatCompletion };
