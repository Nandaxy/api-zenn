const os = require("os");

const formatUptime = (uptimeInSeconds) => {
  const days = Math.floor(uptimeInSeconds / (60 * 60 * 24));
  const hours = Math.floor((uptimeInSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((uptimeInSeconds % (60 * 60)) / 60);
  const seconds = Math.floor(uptimeInSeconds % 60);

  return `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`;
};

const getRuntime = (req, res) => {
  try {
    const uptimeInSeconds = process.uptime();
    const runtime = formatUptime(uptimeInSeconds);

    res.json({ status: true, runtime });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error!" });
  }
};

const getMemoryStatistics = () => {
  const totalMemory = (os.totalmem() / 1024 / 1024).toFixed(2);
  const freeMemory = (os.freemem() / 1024 / 1024).toFixed(2);
  return `${freeMemory}MB / ${totalMemory}MB`;
};

const getCPUStatistics = () => {
  return os.cpus().map((cpu) => ({
    model: cpu.model,
    speed: cpu.speed,
    times: cpu.times,
  }));
};

const getCurrentTime = () => {
  const now = new Date();
  return `${now.getHours()} : ${now.getMinutes()} : ${now.getSeconds()}`;
};

const getSpeedTest = () => {
  const start = process.hrtime();
  const diff = process.hrtime(start);
  return ((diff[0] * 1e9 + diff[1]) / 1e6).toFixed(2);
};

const getStatistics = (req, res) => {
  try {
    const memory = getMemoryStatistics();
    const cpus = getCPUStatistics();
    const time = getCurrentTime();
    const speed = getSpeedTest();

    res.json({
      status: true,
      memory,
      cpu: cpus,
      time,
      speed: `${speed}ms`,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error!" });
  }
};

module.exports = {
  getRuntime,
  getStatistics,
};
