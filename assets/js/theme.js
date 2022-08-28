const sitePreference = document.documentElement.getAttribute(
  "data-default-appearance"
);
const userPreference = localStorage.getItem("appearance");

if (
  (sitePreference === "dark" && userPreference === null) ||
  userPreference === "dark"
) {
  document.documentElement.classList.add("dark");
}

if (document.documentElement.getAttribute("data-auto-appearance") === "true") {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches &&
    userPreference !== "light"
  ) {
    document.documentElement.classList.add("dark");
  }
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (event) => {
      if (event.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    });
}

window.addEventListener("DOMContentLoaded", (event) => {
  const switchers = document.getElementsByName("appearance-switcher");

  if (switchers.length > 0) {
    for (const switcher of switchers) {
      switcher.addEventListener("click", () => {
        document.documentElement.classList.toggle("dark");

        localStorage.setItem(
          "appearance",
          document.documentElement.classList.contains("dark") ? "dark" : "light"
        );
      });

      switcher.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        localStorage.removeItem("appearance");
      });
    }
  }
});
