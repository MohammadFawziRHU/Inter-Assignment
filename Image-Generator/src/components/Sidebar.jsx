import React, { useState, useEffect } from "react";
import "./Styles/Sidebar.css";
import {
  FiCompass, FiEdit, FiSettings, FiImage,
  FiThumbsUp, FiHelpCircle, FiBell,
  FiMoon, FiSun, FiLogIn, FiGlobe, FiEdit3
} from "react-icons/fi";

const menu = [
  { label: "Explore", icon: <FiCompass />, active: true },
  { label: "Create", icon: <FiEdit3 /> },
  { label: "Edit", icon: <FiEdit /> },
  { label: "Personalize", icon: <FiSettings />, new: true },
  { label: "Organize", icon: <FiImage /> },
  { label: "Surveys", icon: <FiThumbsUp /> },
];

export default function Sidebar() {
  const [darkMode, setDarkMode] = useState(true);

  // Toggle class on <body> for global theme
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  const toggleMode = () => {
    setDarkMode(!darkMode);
  };

  const bottom = [
    { label: "Help", icon: <FiHelpCircle /> },
    { label: "Updates", icon: <FiBell /> },
    {
  label: darkMode ? "Dark Mode" : "Light Mode", 
  icon: darkMode ? <FiMoon /> : <FiSun />,
  action: toggleMode,
}
  ];

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
              <button className="sidebar-button" onClick={item.action}>
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
