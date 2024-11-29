import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./comp_css/footer.css";
import SHA_logo from "../assets/sha_logo.png";

export default function StaffFooter() {
  return (
    <div className="footer-body-container">
      <div className="footer-contents-wrapper">
        <div className="footer-wallpaper">
          <div className="footer-contents-container">
            <div className="footer-contents-1">
              <div className="footer-logo-container-wrapper">
                <span className="footer-logo-container">
                  <img src={SHA_logo} />
                </span>
                <span className="footer-logo-det">
                  <span className="shasm-title">
                    Sacred Heart Academy of Santa Maria (Bulacan), Inc.
                  </span>
                  <span className="shasm-since">
                    Providing quality education since 1963
                  </span>
                  <span className="shasm-motto">SHAns that S.H.I.N.E.</span>
                </span>
              </div>
              <div className="footer-address-det">
                <span className="school-address">
                  <i className="bx bxs-map"></i>
                  <span className="txt-details">
                    Dr. Teofilo Santiago Street, Brgy. Poblacion Sta. Maria,
                    Bulacan
                  </span>
                </span>
                <span className="school-contact">
                  <i className="bx bxs-phone"></i>
                  <span className="txt-details">
                    (044) 815-6739 / 0917-425-1963
                  </span>
                </span>
                <span className="school-email">
                  <i className="bx bxs-envelope"></i>{" "}
                  <span className="txt-details">shabulacan@gmail.com</span>
                </span>
              </div>
            </div>

            <div className="footer-contents-2">
              <span className="nav-title">Navigation</span>
              <Link to="/staff_homepage" className="logout-linking-page">
                <span className="footer-home-link">Home</span>
              </Link>
              <Link to="/staff_records" className="logout-linking-page">
                <span className="footer-records-link">Records</span>
              </Link>
            </div>

            <div className="footer-contents-3">
              <span className="connect-title">Connect With Us</span>
              <div className="shasm-outer-link">
                <span className="outer-link-btn">
                  <a
                    href="https://www.facebook.com/shabulacan/"
                    target="_blank"
                  >
                    <i className="bx bxl-facebook"></i>
                  </a>
                </span>
                <span className="outer-link-btn">
                  <a href="https://www.youtube.com/@shabulacan" target="_blank">
                    <i className="bx bxl-youtube"></i>
                  </a>
                </span>
                <span className="outer-link-btn">
                  <a
                    href="https://www.instagram.com/shabulacan1963/"
                    target="_blank"
                  >
                    <i className="bx bxl-instagram-alt"></i>
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-footer">
          <span className="footer-txt">
            © 2023 Sacred Heart Academy of Sta. Maria (Bulacan), Inc. | All
            Rights Reserved | Developed and Maintained by UniID
          </span>
        </div>
      </div>
    </div>
  );
}
