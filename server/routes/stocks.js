const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.ALPHA_VANTAGE_API_KEY;

// GET /api/stocks/:symbol
router.get("/:symbol", async (req, res) => {
  const symbol = req.params.symbol.toUpperCase();

  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await axios.get(url);//make sure to add .env with ALPHA_VANTAGE_API_KEY with your API key to server folder.

    // Log the full response for debugging
    console.log("Alpha Vantage full response:", JSON.stringify(response.data, null, 2));

    // Check for Alpha Vantage error or rate limit messages
    if (response.data["Note"] || response.data["Error Message"]) {
      return res.status(400).json({ error: response.data["Note"] || response.data["Error Message"] });
    }

    const rawData = response.data["Time Series (Daily)"];
    if (!rawData || Object.keys(rawData).length === 0) {
      return res.status(400).json({ error: "Invalid symbol or no data found" });
    }

    const formatted = Object.entries(rawData).slice(0, 30).map(([date, value]) => ({
      date,
      open: Number(value["1. open"]),
      high: Number(value["2. high"]),
      low: Number(value["3. low"]),
      close: Number(value["4. close"])
    })).reverse();

    res.json({ symbol, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stock data" });
  }
});

module.exports = router;

