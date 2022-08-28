toggleMobileNavbar = () => {
  const drawer = document.getElementById("mobile-navbar");

  drawer.classList.toggle("h-0");
  drawer.classList.toggle("border");
  drawer.style.height = '238px';

  setTimeout(() => {
    drawer.style.height = null;
    drawer.classList.toggle("h-fit");
  }, 100);
};

window.addEventListener("DOMContentLoaded", () => {
  const navbarSwitch = document.getElementById("toggle-mobile-navbar");

  if (navbarSwitch) {
    navbarSwitch.addEventListener("click", () => {
      toggleMobileNavbar();
    });
  }
});
