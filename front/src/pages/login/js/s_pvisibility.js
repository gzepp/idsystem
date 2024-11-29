import React, { useState, useEffect } from "react";

export function togglePasswordVisibility() {
  const input = document.querySelector(".password-u-field");
  const S_showBtn = document.querySelector(".S_showBtn");

  if (input.type === "password") {
    input.type = "text";
    S_showBtn.textContent = "HIDE";
    S_showBtn.style.color = "#47B8B2";
  } else {
    input.type = "password";
    S_showBtn.textContent = "SHOW";
    S_showBtn.style.color = "#404040";
  }

  // Check if the input value is empty and hide the button
  if (!input.value) {
    S_showBtn.style.display = "none";
  }
}
