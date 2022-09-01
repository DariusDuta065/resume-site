const NAVBAR_HEIGHT = 220; // px
const TRANSITION_DURATION = 100; // ms

toggleMobileNavbar = () => {
  const drawer = document.getElementById("mobile-navbar");
  const isOpen = !drawer.classList.contains("h-0");

  if (!isOpen) {
    drawer.classList.toggle("h-0");
    drawer.style.height = `${NAVBAR_HEIGHT}px`;

    setTimeout(() => {
      drawer.classList.toggle("h-fit");
      drawer.style.height = null;
    }, TRANSITION_DURATION);
  } else {
    drawer.classList.toggle("h-0");
    drawer.style.height = `${NAVBAR_HEIGHT}px`;

    setTimeout(() => {
      drawer.classList.toggle("h-fit");
      drawer.style.height = null;
    }, TRANSITION_DURATION);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const navbarSwitch = document.getElementById("toggle-mobile-navbar");

  if (navbarSwitch) {
    navbarSwitch.addEventListener("click", () => {
      toggleMobileNavbar();
    });
  }
});
