const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing: {
        modal: "734px",
      },
      height: {
        130: "130px",
      },
    },
    colors: {
      orange: "#FE5F55",
      blue: {
        dark: "#1D3557",
        oil: "#457B9D",
        light: "#BCF8EC",
      },
      grey: {
        light: "#E3E3E3",
        medium: "#A6A6A6",
      },
      beije: "#F1FAEE",
      white: "#FFFFFF",
    },
    fontSize: {
      xs: ["9px", "120%"],
      sm: ["11px", "120%"],
      base: ["14px", "120%"],
      md: ["18px", "120%"],
      lg: ["22px", "120%"],
      xl: ["34px", "120%"],
      xxl: ["56px", "120%"],
      hero: ["76px", "120%"],
    },
  },
  plugins: [],
};
