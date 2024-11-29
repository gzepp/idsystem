export function removeCloseFromClass() {
  const navElement = document.querySelector(".a_sidebar.close");
  if (navElement) {
    if (navElement.classList.contains("close")) {
      navElement.classList.remove("close");
    } else {
      navElement.classList.add("close");
    }
  }
}
export function handleDropdownClick() {
  // Use a more specific selector or ensure there's only one element with the class '.arrow'
  const recDdMenu = document.querySelector(".rec-dd-menu");
  const arrow = document.querySelector(".arrow");

  if (arrow.classList.contains("down")) {
    arrow.classList.remove("down");
    // Assuming recDdMenu is a reference to your dropdown menu
    recDdMenu.classList.add("open");
    recDdMenu.style.display = "block"; // Show the menu
  } else {
    arrow.classList.remove("open");
    // Assuming recDdMenu is a reference to your dropdown menu
    recDdMenu.classList.add("down");
    recDdMenu.style.display = "none"; // Hide the menu
  }
}
export function handleDropdownArchives() {
  // Use a more specific selector or ensure there's only one element with the class '.arrow'
  const recDdMenu = document.querySelector(".rec-dd-menu");
  const arrow = document.querySelector(".arrow");

  if (arrow.classList.contains("down")) {
    arrow.classList.remove("down");
    // Assuming recDdMenu is a reference to your dropdown menu
    recDdMenu.classList.add("open");
    recDdMenu.style.display = "block"; // Show the menu
  } else {
    arrow.classList.remove("open");
    // Assuming recDdMenu is a reference to your dropdown menu
    recDdMenu.classList.add("down");
    recDdMenu.style.display = "none"; // Hide the menu
  }
}

