import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./App.css"; 
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";

function App() {
  const [input, setInput] = useState("");
  const [trackedStocks, setTrackedStocks] = useState([]);
  const [stockDataMap, setStockDataMap] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addStock = async () => {
    const symbol = input.toUpperCase();
    if (!symbol || trackedStocks.includes(symbol)) return;

    try {
      const res = await fetch(`http://localhost:5000/api/stocks/${symbol}`);
      const json = await res.json();

      if (json.error) {
        alert(json.error);
        return;
      }

      setTrackedStocks([...trackedStocks, symbol]);
      setStockDataMap(prev => ({ ...prev, [symbol]: json.data }));
    } catch (err) {
      alert("Failed to fetch stock data.");
    }

    setInput("");
  };

  const removeStock = (symbol) => {
    setTrackedStocks(trackedStocks.filter(s => s !== symbol));
    const newMap = { ...stockDataMap };
    delete newMap[symbol];
    setStockDataMap(newMap);
  };

  // Merge all stock data by date
  const mergedData = (() => {
    const dates = new Set();
    trackedStocks.forEach(s => stockDataMap[s]?.forEach(d => dates.add(d.date)));

    const sortedDates = Array.from(dates).sort();
    return sortedDates.map(date => {
      const entry = { date };
      trackedStocks.forEach(s => {
        const match = stockDataMap[s]?.find(d => d.date === date);
        if (match) entry[s] = match.price;
      });
      return entry;
    });
  })();

  return (
    <div className="App">
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="content">
        <div className="input-group">
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Ticker (e.g., AAPL)" />
          <button onClick={addStock}>Add Stock</button>
        </div>
        <ul>
          {trackedStocks.map(s => (
            <li key={s}>
              {s} <button onClick={() => removeStock(s)}>Remove</button>
            </li>
          ))}
        </ul>
        {mergedData.length > 0 && (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={mergedData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {trackedStocks.map(symbol => (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={`#${Math.floor(Math.random()*16777215).toString(16)}`}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </main>
    </div>
  );
}

export default App;
