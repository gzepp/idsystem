// passwordUtils.js
export const calculatePasswordStrength = (inputValue) => {
  // Selecting DOM elements with specific classes
  const indicator = document.querySelector(".indicator"); // An element to display the password strength indicator
  const weak = document.querySelector(".weak"); // Element for weak password
  const medium = document.querySelector(".medium"); // Element for medium password
  const strong = document.querySelector(".strong"); // Element for strong password
  const showBtn = document.querySelector(".showBtn"); // Show/Hide button

  // Regular expressions to check for different password characteristics
  let regExpWeak = /[a-z ]/; // Matches lowercase letters
  let regExpMedium = /\d+/; // Matches at least one digit
  let regExpStrong = /[!@#\$%\^&\*\?_~\-()]/; // Matches special characters
  let no = 0; // A variable to store password strength level (0 = weak, 1 = medium, 2 = strong)

  // Check if the input value is not empty
  if (inputValue !== "") {
    // Display the password strength indicator
    indicator.style.display = "block";
    indicator.style.display = "flex"; // Makes it a flex container

    // Check for weak password conditions
    if (
      inputValue.length &&
      (inputValue.match(regExpWeak) ||
        inputValue.match(regExpMedium) ||
        inputValue.match(regExpStrong))
    )
      no = 1;

    // Check for medium password conditions
    if (
      inputValue.length >= 6 &&
      ((inputValue.match(regExpWeak) && inputValue.match(regExpMedium)) ||
        (inputValue.match(regExpMedium) && inputValue.match(regExpStrong)) ||
        (inputValue.match(regExpWeak) && inputValue.match(regExpStrong)))
    )
      no = 2;

    // Check for strong password conditions
    if (
      inputValue.length >= 6 &&
      inputValue.match(regExpWeak) &&
      inputValue.match(regExpMedium) &&
      inputValue.match(regExpStrong)
    )
      no = 3;

    // Handle weak password
    if (no === 1) {
      weak.classList.add("active"); // Add 'active' class for styling
    } else {
      weak.classList.remove("active"); // Remove 'active' class
    }

    // Handle medium password
    if (no === 2) {
      weak.classList.add("active");
      medium.classList.add("active");
    } else {
      medium.classList.remove("active");
    }

    // Handle strong password
    if (no === 3) {
      weak.classList.add("active");
      medium.classList.add("active");
      strong.classList.add("active");
    } else {
      strong.classList.remove("active");
    }

    // Show the Show/Hide button and add functionality
    showBtn.style.display = "flex";
    showBtn.onclick = function () {
      const input = document.querySelector(".password-field");
      if (input.type === "password") {
        input.type = "text";
        showBtn.textContent = "HIDE";
        showBtn.style.color = "#C76565";
      } else {
        input.type = "password";
        showBtn.textContent = "SHOW";
        showBtn.style.color = "#47B8B2";
      }
    };
  } else {
    // If the input is empty, hide the password strength indicator, text, and Show/Hide button
    indicator.style.display = "none";
    showBtn.style.display = "none";
  }
};

export const handlePasswordChange = (
  password,
  confirmPassword,
  setPassword,
  setPasswordsMatch,
  event
) => {
  const newPassword = event.target.value;
  setPassword(newPassword);
  // Check if passwords match when the main password changes
  setPasswordsMatch(newPassword === confirmPassword);
};

export const handleConfirmPasswordChange = (
  password,
  confirmPassword,
  setConfirmPassword,
  setPasswordsMatch,
  event
) => {
  const newConfirmPassword = event.target.value;
  setConfirmPassword(newConfirmPassword);
  // Check if passwords match when the confirm password changes
  setPasswordsMatch(newConfirmPassword === password);
};
