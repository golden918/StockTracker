const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// GET /api/stocks/:symbol
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await axios.get(url);

    const rawData = response.data["Time Series (Daily)"];
    if (!rawData) {
      return res.status(400).json({ error: "Invalid symbol or API limit reached" });
    }

    // Format the response data for frontend
    const formatted = Object.entries(rawData).slice(0, 30).map(([date, value]) => ({
      date,
      price: Number(value["4. close"]),
    })).reverse(); // chronological order

    res.json({ symbol, data: formatted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

module.exports = router;
