import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./comp_css/admin_sidebar.css";
import "./comp_js/sidebar";
import UniID_logo from "../assets/uniid_mainlogo.png";
import UniID_logotxt from "../assets/uniid_logotxt.png";
import SHA_logo from "../assets/sha_logo.png";

export default function AdminSidebar() {
  const [isClosed, setIsClosed] = useState(true);
  const [isDown, setIsDown] = useState(false);
  const [isDownArch, setIsDownArch] = useState(false);

  const handleLogoContainerClick = () => {
    setIsClosed(!isClosed);
  };

  const handleDropdownClick = () => {
    setIsDown(!isDown);
  };

  const handleDropdownArchives = () => {
    setIsDownArch(!isDownArch);
  };

  return (
    <div className="SB_body">
      <nav className={`a_sidebar ${isClosed ? "close" : ""}`}>
        <header>
          <div className="header-logo">
            <span className="txt-logo-container">
              <span
                className="logo-container"
                onClick={handleLogoContainerClick}
              >
                <img className="uniid-logo" src={UniID_logo} alt="UniID Logo" />
              </span>
              <img
                className="uniid-txt-logo"
                src={UniID_logotxt}
                alt="UniID Logo"
              />
            </span>
          </div>
        </header>

        <div className="a-menu-container">
          <div className="a-menu">
            <ul className="a-menu-links">
              <li className="a-dashboard">
                <Link to="/admin_dashboard" className="linking-page">
                  <span className="dashboard-click">
                    <i className="bx bxs-dashboard"></i>
                    <p className="dashboard-txt">Dashboard</p>
                  </span>
                </Link>
              </li>

              <li className="a-announcements">
                <Link to="/admin_anno_list" className="linking-page">
                  <span className="announcements-click">
                    <i className="bx bxs-megaphone"></i>
                    <p className="announcements-txt">Announcements</p>
                  </span>
                </Link>
              </li>

              <li className="a-records">
                <span className="records-click" onClick={handleDropdownClick}>
                  <i className="bx bx-file"></i>
                  <p className="records-txt">Records</p>
                  {/* Toggle the 'down' class based on the state */}
                  <span className={`arrow ${isDown ? "down" : ""}`}>
                    <i className="bx bxs-chevron-down"></i>
                  </span>
                </span>
              </li>

              {/* Dropdown content */}
              {isDown && (
                <div className="rec-dd-menu">
                  <ul className="a-records-dd">
                    <Link to="/admin_user_records" className="linking-page">
                      <li className="student-click">
                        <p className="student-txt">Student</p>
                      </li>
                    </Link>

                    <Link to="/admin_staff_records" className="linking-page">
                      <li className="staff-click">
                        <p className="staff-txt">Staff</p>
                      </li>
                    </Link>

                    <Link
                      to="/admin_attendance_records"
                      className="linking-page"
                    >
                      <li className="attendance-click">
                        <p className="attendance-txt">Attendance</p>
                      </li>
                    </Link>
                  </ul>
                </div>
              )}

              <li className="a-records">
                <span
                  className="records-click"
                  onClick={handleDropdownArchives}
                >
                  <i className="bx bxs-archive-in"></i>
                  <p className="records-txt">Archives</p>
                  {/* Toggle the 'down' class based on the state */}
                  <span className={`arrow ${isDownArch ? "down" : ""}`}>
                    <i className="bx bxs-chevron-down"></i>
                  </span>
                </span>
              </li>

              {/* Dropdown content */}
              {isDownArch && (
                <div className="rec-dd-menu">
                  <ul className="a-records-dd">
                    <Link to="/admin_archive_student" className="linking-page">
                      <li className="student-click">
                        <p className="student-txt">Student</p>
                      </li>
                    </Link>

                    <Link to="/admin_archive_staff" className="linking-page">
                      <li className="staff-click">
                        <p className="staff-txt">Staff</p>
                      </li>
                    </Link>

                    <Link to="/admin_archive_id" className="linking-page">
                      <li className="staff-click">
                        <p className="staff-txt">Lost ID</p>
                      </li>
                    </Link>
                  </ul>
                </div>
              )}

              <li className="a-announcements">
                <Link to="/admin_id_reports" className="linking-page">
                  <span className="announcements-click">
                    <i className="bx bxs-id-card"></i>
                    <p className="announcements-txt">Lost ID Report</p>
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin Account Profile */}
          <div className="a-profile">
            <div className="a-pp-cont">
              <div className="admin-cont">
                <img className="admin-logo" src={SHA_logo} alt="SHA Logo" />
              </div>
            </div>

            <div className="a-details">
              <div className="admin-name">SHASM Admin</div>
              <div className="admin-accno">Account No: 2023-0000-0000</div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
