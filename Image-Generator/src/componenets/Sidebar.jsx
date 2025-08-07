// src/components/Sidebar.jsx
import React from "react";
import "./Styles/Sidebar.css";
import {
  FiCompass, FiEdit, FiSettings, FiImage,
  FiThumbsUp, FiHelpCircle, FiBell, FiMoon,
  FiLogIn, FiGlobe, FiEdit3
} from "react-icons/fi";

const menu = [
  { label: "Explore", icon: <FiCompass />, active: true },
  { label: "Create", icon: <FiEdit3 /> },
  { label: "Edit", icon: <FiEdit /> },
  { label: "Personalize", icon: <FiSettings />, new: true },
  { label: "Organize", icon: <FiImage /> },
  { label: "Surveys", icon: <FiThumbsUp /> },
];

const bottom = [
  { label: "Help", icon: <FiHelpCircle /> },
  { label: "Updates", icon: <FiBell /> },
  { label: "Dark Mode", icon: <FiMoon /> },
];

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div>
        <h1 className="sidebar-title">Midjourney</h1>
        <ul className="sidebar-menu">
          {menu.map((item, idx) => (
            <li key={idx}>
              <button className={`sidebar-button ${item.active ? "active" : ""}`}>
                {item.icon}
                <span>{item.label}</span>
               
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-bottom">
        <ul className="sidebar-menu">
          {bottom.map((item, idx) => (
            <li key={idx}>
              <button className="sidebar-button">
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>

        <button className="sidebar-button login-btn">
          <FiLogIn />
          <span>Log In</span>
        </button>
        <button className="sidebar-button signup-btn">
          <FiGlobe />
          <span>Sign Up</span>
        </button>
      </div>
    </div>
  );
}
