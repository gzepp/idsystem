import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SHA_logo from "../assets/sha_logo.png";
import { logOut } from "../utils";
import { useAppUniidContext } from "../context";

import "./comp_css/general_tb.css";

export default function StaffTopbar({ userName }) {
  const [globalState, dispatch] = useAppUniidContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogOut, showSetLogOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutShow = () => showSetLogOut(true);
  const logoutClose = () => showSetLogOut(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  const formattedDateTime = currentTime.toLocaleString(undefined, options);

  // Parse profile to set active inactive status
  const profileString = window.sessionStorage.getItem("profile");
  const profileObject = JSON.parse(profileString);

  return (
    <div>
      <nav className="staff-topbar-main">
        <div className="staff-topbar-cont-wrapper">
          <div className="staff-topbar-cont">
            <div className="left-tb">
              <span className="SHA-logo">
                <img src={SHA_logo} alt="SHA Logo" />
              </span>
              <div className="topbar-name">
                <p className="staff-page-name">Welcome Back, {userName}!</p>
                <p className="time-date">{formattedDateTime}</p>
              </div>
            </div>

            <div className="right-tb">
              {/* Hamburger menu icon for mobile view */}
              <span
                className="hamburger-menu"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <i
                  className={`bx ${isMobileMenuOpen ? "bx-x" : "bx-menu"}`}
                ></i>
              </span>

              <div className="page-buttons-container">
                <Link to="/staff_homepage" className="nav-linking-page">
                  <span className="homepage-btn">Home</span>
                </Link>
                <Link to="/staff_records" className="nav-linking-page">
                  <span className="records-btn">Records</span>
                </Link>
                
              </div>

              <span className="logout-container" onClick={logoutShow}>
                <i className="bx bx-log-out"></i>
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile and Tablet View */}
      <div className={`mobile-menu ${isMobileMenuOpen ? "menu-open" : ""}`}>
        <span
          className="hamburger-menu"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className="bx bx-left-arrow-circle"></i>
        </span>
        <Link to="/staff_homepage" className="topbar-navigation">
          <span className="nav-text">Home</span>
        </Link>
        <Link to="/staff_records" className="topbar-navigation">
          <span className="nav-text">Records</span>
        </Link>
        <span className="topbar-navigation" onClick={logoutShow}>
          <span className="nav-text">Logout</span>
        </span>
      </div>

      {/* Logout Modal */}
      {showLogOut && (
        <div className="qr-popup-overlay">
          <div className="logout-modal">
            <div className="logout-modal-container">
              <div className="logout-header">
                <span className="logout-icon">
                  <i className="bx bx-error-circle"></i>
                </span>
                <span className="logout-title">Confirm User Log Out</span>
              </div>
              <div className="logout-selection-container">
                <span className="cancel-logout-btn" onClick={logoutClose}>
                  CANCEL
                </span>
                <div className="logout-linking-page">
                  <span
                    onClick={() =>
                      logOut(dispatch, profileObject.idNumber, "staff")
                    }
                    className="confirm-logout-btn"
                  >
                    LOGOUT
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
