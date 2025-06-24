import React from "react";
import logo from "../assets/stocktracker-logo.png";
import "./Header.css";

export default function Header({ onToggleSidebar }) {
  return (
    <header className="header centered-header">
      <div className="logo-container">
        <img src={logo} alt="Stock Tracker Logo" className="logo" />
        <h1>Stock Tracker</h1>
      </div>
    </header>
  );
}
