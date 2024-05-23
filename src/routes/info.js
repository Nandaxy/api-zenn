const express = require("express");
const router = express.Router();

const { getRuntime, getStatistics } = require("../controller/info");

router.get("/system/runtime", getRuntime);
router.get("/system/statistic", getStatistics);

module.exports = router;
