import React, { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import StockCapsule from "./components/StockCapsule";
import "./App.css";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";

function App() {
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize rows: you can rename or add more
  const [rows, setRows] = useState({
    watchlist: [],
    favorites: []
  });

  const [stockDataMap, setStockDataMap] = useState({});

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const addStock = async () => {
    const symbol = input.toUpperCase();
    if (!symbol) return;

    const alreadyTracked = Object.values(rows).flat().includes(symbol);
    if (alreadyTracked) return;

    try {
      const res = await fetch(`http://localhost:5000/api/stocks/${symbol}`);
      const json = await res.json();

      if (json.error) {
        alert(json.error);
        return;
      }

      setStockDataMap(prev => ({ ...prev, [symbol]: json.data }));
      setRows(prev => ({
        ...prev,
        watchlist: [...prev.watchlist, symbol]
      }));
    } catch (err) {
      alert("Failed to fetch stock data.");
    }

    setInput("");
  };

  const removeStock = (symbol) => {
    const newRows = {};
    for (const row in rows) {
      newRows[row] = rows[row].filter(s => s !== symbol);
    }
    setRows(newRows);
    const newMap = { ...stockDataMap };
    delete newMap[symbol];
    setStockDataMap(newMap);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    // If dropped in the same place, do nothing
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Dragging within the same list
    if (source.droppableId === destination.droppableId) {
      const list = Array.from(rows[source.droppableId]);
      const [movedItem] = list.splice(source.index, 1);
      list.splice(destination.index, 0, movedItem);

      setRows(prev => ({
        ...prev,
        [source.droppableId]: list
      }));
    } else {
      // Dragging between different lists
      const sourceList = Array.from(rows[source.droppableId]);
      const destList = Array.from(rows[destination.droppableId]);
      const [movedItem] = sourceList.splice(source.index, 1);
      destList.splice(destination.index, 0, movedItem);

      setRows(prev => ({
        ...prev,
        [source.droppableId]: sourceList,
        [destination.droppableId]: destList
      }));
    }
  };

  return (
    <div className="App">
      <Header onToggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      <main className="content">
        <div className="input-group">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter Ticker (e.g., AAPL)"
          />
          <button onClick={addStock}>Add Stock</button>
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(rows).map(([rowId, stockList]) => (
            <section key={rowId}>
              <h2>{rowId.charAt(0).toUpperCase() + rowId.slice(1)}</h2>
              <Droppable droppableId={rowId} direction="horizontal">
                {(provided) => (
                  <div
                    className="dashboard-row"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    {stockList.map((symbol, index) => (
                      <StockCapsule
                        key={symbol}
                        symbol={symbol}
                        index={index}
                        onRemove={removeStock}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </section>
          ))}
        </DragDropContext>
      </main>
    </div>
  );
}

export default App;
