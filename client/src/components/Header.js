import React from "react";
import "./Header.css";

export default function Header({ onToggleSidebar }) {
  return (
    <header className="header">
      <h1>Stock Tracker</h1>
      <button className="toggle-btn" onClick={onToggleSidebar}>☰</button>
    </header>
  );
}
