const express = require("express");
const { getRuntime, getStatistics } = require("../controller/info");
const router = express.Router();

router.get("/system/runtime", getRuntime);
router.get("/system/statistic", getStatistics);

module.exports = router;
