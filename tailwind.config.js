/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      container: {
        center: true,
        padding: {
          default: "12px",
          md: "20px",
        },
      },
      colors: {
        opacityRed: "rgb(243 82 82 / 11%)",
        opacityGreen: "rgb(134 239 172 / 20%)",
      },
    },
  },
  plugins: [],
};
