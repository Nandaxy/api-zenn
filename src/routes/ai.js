const express = require("express");
const { groqAi } = require("../controller/ai");
const router = express.Router();

router.get("/ai/groq", groqAi);

module.exports = router;
