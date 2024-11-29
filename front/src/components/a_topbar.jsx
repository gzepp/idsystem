import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./comp_css/admin_tb.css";
import { logOut } from "../utils";
import { useAppUniidContext } from "../context";

export default function AdminTopbar({ pageName }) {
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
      <nav className="a-topbar-main">
        <div className="a-topbar-cont">
          <div className="left-port">
            <span className="menu-exp-cont">
              <i className="bx bx-menu"></i>
            </span>
            <div className="page-header-name">
              <p className="a-page-name">{pageName}</p>
              <p className="time-date">{formattedDateTime}</p>
            </div>
          </div>

          <div className="right-port">
            <span className="logout-container" onClick={logoutShow}>
              <i className="bx bx-log-out"></i>
            </span>
          </div>
        </div>
      </nav>
      {/* Delete Modal */}
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
                      logOut(dispatch, profileObject.idNumber, "admin")
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
