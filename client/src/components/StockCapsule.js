// StockCapsule.js
import React from "react";
import { Draggable } from "@hello-pangea/dnd";
import "./StockCapsule.css";

export default function StockCapsule({ symbol, index, onRemove }) {
  return (
    <Draggable draggableId={symbol} index={index}>
      {(provided) => (
        <div
          className="stock-capsule"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="capsule-header">
            <span>{symbol}</span>
            <button onClick={() => onRemove(symbol)}>×</button>
          </div>
          {/* Add more stock info here like price or chart preview */}
        </div>
      )}
    </Draggable>
  );
}
