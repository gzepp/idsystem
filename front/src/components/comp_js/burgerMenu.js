import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import initSwiper from "./general_tb.css"; // Import your CSS file

import SHA_logo from "../assets/sha_logo.png";
import { logOut } from "../utils";
import { useAppUniidContext } from "../context";

export default function StaffTopbar({ userName }) {
  const [globalState, dispatch] = useAppUniidContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLogOut, showSetLogOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logoutShow = () => showSetLogOut(true);
  const logoutClose = () => showSetLogOut(false);
}