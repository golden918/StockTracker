// StockCapsule.js
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./StockCapsule.css";

export default function StockCapsule({ symbol, index, onRemove, onSelect, data }) {
  return (
    <Draggable draggableId={symbol} index={index}>
      {(provided) => (
        <div
          className="stock-capsule"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={onSelect}
        >
          <div className="capsule-header">
            <span>{symbol}</span>
            <button onClick={(e) => {
              e.stopPropagation(); // Prevent table select on remove
              onRemove(symbol);
            }}>×</button>
          </div>
          {data ? (
            <table className="stock-data-table">
              <tbody>
                <tr>
                <td>Price:</td>
                <td>{data[data.length - 1]?.close?.toFixed(2) ?? "N/A"}</td>
                </tr>
                <tr>
                <td>Change:</td>
                <td>
                  {data.length >= 2
                    ? (() => {
                        const newest = parseFloat(data[data.length - 1].close);
                        const oldest = parseFloat(data[0].close);
                        if (isNaN(newest) || isNaN(oldest)) return "N/A";
                        const change = newest - oldest;
                        const sign = change >= 0 ? "+" : "-";
                        return `${sign}$${Math.abs(change).toFixed(2)}`;
                      })()
                    : "N/A"}
                </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      )}
    </Draggable>
  );
}
