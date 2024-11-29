import React, { useState, useEffect } from "react";

export function togglePasswordVisibility() {
  const input = document.querySelector(".password-u-field");
  const U_showBtn = document.querySelector(".U_showBtn");

  if (input.type === "password") {
    input.type = "text";
    U_showBtn.textContent = "HIDE";
    U_showBtn.style.color = "#47B8B2";
  } else {
    input.type = "password";
    U_showBtn.textContent = "SHOW";
    U_showBtn.style.color = "#404040";
  }

  // Check if the input value is empty and hide the button
  if (!input.value) {
    U_showBtn.style.display = "none";
  }
}
