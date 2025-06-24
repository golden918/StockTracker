// StockOhlcChart.js
import React from "react";
import {
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Customized,
  Line
} from "recharts";

export default function StockOhlcChart({ data, symbol }) {
  if (!data || data.length === 0) return null;

  const isMobile = window.innerWidth < 600;

  // Determine Y-axis range based on full high/low spread
  const minY = Math.floor(Math.min(...data.map(d => parseFloat(d.low))) - 1);
  const maxY = Math.ceil(Math.max(...data.map(d => parseFloat(d.high))) + 1);

  return (
    <div style={{ marginTop: "2rem", width: isMobile ? "90%" : "100%", height: isMobile ? 300 : "60vh", minHeight: 300, marginLeft: "auto", marginRight: "auto" }}>
      <h2 style={{ marginBottom: "1rem", fontWeight: 600, fontSize: "clamp(1rem, 2.5vw, 1.5rem)" }}>{symbol} - 30 Day Price Overview</h2>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 20, bottom: isMobile ? 10 : 40, left: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
          <XAxis
            dataKey="date"
            tick={false}
            interval={isMobile ? Math.ceil(data.length / 4) : 0}
            padding={{ left: 10, right: 10 }}
            height={0}
          />
          <YAxis
            type="number"
            domain={[minY, maxY]}
            tick={{ fontSize: 12 }}
            width={60}
          />
          <Tooltip
            content={({ label }) => {
              const entry = data.find(d => d.date === label);
              if (!entry) return null;
              return (
                <div style={{
                  background: '#fff',
                  border: '1px solid #ccc',
                  padding: '10px',
                  fontSize: '0.85rem',
                  borderRadius: '6px',
                  maxWidth: '200px'
                }}>
                  <strong>{label}</strong><br />
                  High: ${entry.high.toFixed(2)}<br />
                  Low: ${entry.low.toFixed(2)}<br />
                  Open: ${entry.open.toFixed(2)}<br />
                  Close: ${entry.close.toFixed(2)}
                </div>
              );
            }}
          />

          {/* Transparent line to activate tooltip */}
          <Line type="monotone" dataKey="close" stroke="transparent" dot={false} />

          <Customized
            component={({ xAxisMap, yAxisMap, data }) => {
              const xAxis = Object.values(xAxisMap)[0];
              const yAxis = Object.values(yAxisMap)[0];
              const yScale = yAxis.scale;
              const xScale = xAxis.scale;

              return (
                <g>
                  {data.map((entry, index) => {
                    const high = parseFloat(entry.high);
                    const low = parseFloat(entry.low);
                    const open = parseFloat(entry.open);
                    const close = parseFloat(entry.close);

                    if (
                      isNaN(high) || isNaN(low) || isNaN(open) || isNaN(close)
                    ) {
                      return null;
                    }

                    const x = xScale(entry.date);
                    const yHigh = yScale(high);
                    const yLow = yScale(low);
                    const yOpen = yScale(open);
                    const yClose = yScale(close);
                    const color = close >= open ? "#28a745" : "#dc3545";

                    const strokeWidth = isMobile ? 3 : 6;

                    return (
                      <g key={index}>
                        {/* Vertical line: high to low */}
                        <line
                          x1={x}
                          y1={yHigh}
                          x2={x}
                          y2={yLow}
                          stroke={color}
                          strokeWidth={strokeWidth}
                        />
                        {/* Open tick (left) */}
                        <line
                          x1={x - 4}
                          y1={yOpen}
                          x2={x}
                          y2={yOpen}
                          stroke={color}
                          strokeWidth={strokeWidth}
                        />
                        {/* Close tick (right) */}
                        <line
                          x1={x}
                          y1={yClose}
                          x2={x + 4}
                          y2={yClose}
                          stroke={color}
                          strokeWidth={strokeWidth}
                        />
                      </g>
                    );
                  })}
                </g>
              );
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}




