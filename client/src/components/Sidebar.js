import React from "react";
import "./Sidebar.css";

export default function Sidebar({ isOpen }) {
  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <ul>
        <li>Settings</li>
        <li>Profile</li>
        <li>About</li>
        {/* Add more items as needed */}
      </ul>
    </aside>
  );
}
