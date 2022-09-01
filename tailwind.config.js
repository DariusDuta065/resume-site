const colors = require("tailwindcss/colors");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./layouts/**/*.html", "./content/**/*.md"],
  darkMode: "class",

  theme: {
    extend: {
      fontFamily: {
        sans: ["Fira Sans", ...defaultTheme.fontFamily.sans],
      },

      typography: {
        DEFAULT: {
          css: {
            "code::before": { content: "" },
            "code::after": { content: "" },
          },
        },
      },

      colors: {
        "primary": colors.gray,
        "cv-dark-blue": "#00232b",
        "cv-light-blue": "#708bb2",
        "cv-skills-gray": "#7f9195",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
