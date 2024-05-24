const Counter = require("../models/counter");

const addCounter = async (req, res) => {
  const query = req.query.q;
  const secret = req.query.secret;

  if (!query) {
    return res.json({ status: false, message: "Query is required, if necessary, add a query secret to secure the counter data" });
  }

  try {
    let counter = await Counter.findOne({ query });

    if (counter) {
      if (counter.secret && counter.secret !== secret) {
        return res.json({ status: false, message: "Invalid secret" });
      }
      counter.count += 1;
    } else {
      if (secret) {
        counter = new Counter({ query, count: 1, secret });
      } else {
        counter = new Counter({ query, count: 1 });
      }
    }

    await counter.save();

    res.json({
      status: true,
      message: "Counter updated successfully",
      data: {
        query: counter.query,
        count: counter.count,
      },
    });
  } catch (error) {
    console.error("Error updating counter:", error);
    res.json({ status: false, message: "Internal server error" });
  }
};

const viewCounter = async (req, res) => {
  const query = req.query.q;
  const secret = req.query.secret;

  if (!query) {
    return res.json({ status: false, message: "Query is required" });
  }

  try {
    const counter = await Counter.findOne({ query: query });

    if (!counter) {
      return res.json({
        status: false,
        message: "Data not found",
      });
    }

    if (counter.secret && counter.secret !== secret) {
      return res.json({ status: false, message: "Invalid secret" });
    }

    res.json({
      status: true,
      message: "Counter fetched successfully",
      data: {
        query: counter.query,
        count: counter.count,
      },
    });
  } catch (error) {
    console.error("Error fetching counter:", error);
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

module.exports = { addCounter, viewCounter };
