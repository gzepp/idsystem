import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import "./comp_css/general_tb.css";
import SHA_logo from "../assets/sha_logo.png";
import { logOut } from "../utils";
import { useAppUniidContext } from "../context";

export default function RegTopbar({ userName }) {
  const [globalState, dispatch] = useAppUniidContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogOut, showSetLogOut] = useState(false);

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

  //parse profile to set active inactive status
  const profileString = window.sessionStorage.getItem("profile");
  const profileObject = JSON.parse(profileString);
  useEffect(() => {
    console.log("Toppp darrrrrrrr", profileObject.idNumber);
  }, []);

  return (
    <div>
      <nav className="staff-topbar-main">
        <div className="staff-topbar-cont-wrapper">
          <div className="staff-topbar-cont">
            <div className="left-tb">
              <span className="SHA-logo">
                <img src={SHA_logo} />
              </span>
              <div className="topbar-name">
                <p className="staff-page-name">Welcome Back, {userName}!</p>
                <p className="time-date">{formattedDateTime}</p>
              </div>
            </div>

            <div className="right-tb">
              <div className="page-buttons-container">
                <Link to="/reg_homepage" className="nav-linking-page">
                  <span className="homepage-btn">Home</span>
                </Link>
                <Link to="/reg_records" className="nav-linking-page">
                  <span className="records-btn">Records</span>
                </Link>
                <Link to="/reg_reports" className="nav-linking-page">
                  <span className="records-btn">Reports</span>
                </Link>
              </div>

              <span className="logout-container" onClick={logoutShow}>
                <i className="bx bx-log-out"></i>
              </span>
            </div>
          </div>
        </div>
      </nav>

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
