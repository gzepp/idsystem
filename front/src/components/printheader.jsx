import React, { useState, useEffect } from "react";
import "./comp_css/print_header.css";
import SHA_header from "../assets/SHA_header.png"
import SHA_logo from "../assets/sha_logo.png";

export default function PrintHeader() {
  return (
    <div className="header-body-container">
      <div className="header-container">
        <div className="header-logo">
          <img alt="SHA Logo" width={"500px"} src={SHA_header} />
        </div>
      </div>
    </div>
  );
}
