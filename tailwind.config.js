const plugin = require('tailwindcss/plugin');
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

      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "code::before": { content: "" },
            "code::after": { content: "" },

            a: {
              textDecoration: "underline",
              textDecorationColor: theme("colors.purple.300 / 1"),
              fontWeight: "500",
              "&:hover": {
                color: "white", // theme("colors.neutral.DEFAULT / 1"),
                textDecoration: "none",
                backgroundColor: theme("colors.purple.600 / 1"),
                borderRadius: "0.09rem",
              },
            },
            "a code": {
              color: "var(--tw-prose-code)",
            },

            kbd: {
              backgroundColor: theme("colors.neutral.200 / 1"),
              padding: "0.1rem 0.4rem",
              borderRadius: "0.25rem",
              fontSize: "0.9rem",
              fontWeight: "600",
            },
            mark: {
              color: theme("colors.neutral.800 / 1"),
              backgroundColor: theme("colors.secondary.200 / 1"),
              padding: "0.1rem 0.2rem",
              borderRadius: "0.12rem",
            },
          },
        },
        invert: {
          css: {
            a: {
              textDecorationColor: theme("colors.neutral.600 / 1"),
            },
            kbd: {
              color: theme("colors.neutral.200 / 1"),
              backgroundColor: theme("colors.neutral.700 / 1"),
            },
            mark: {
              backgroundColor: theme("colors.secondary.400 / 1"),
            },
          },
        },
      }),

      colors: {
        primary: colors.gray,
        "cv-dark-blue": "#00232b",
        "cv-light-blue": "#708bb2",
        "cv-skills-gray": "#7f9195",
      },
    },
  },

  plugins: [
    require("@tailwindcss/typography"),
    plugin(function({ addVariant }) {
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('not-last', '&:not(:last-child)')
    })
],
  
};
