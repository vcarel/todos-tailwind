module.exports = {
  darkMode: false,
  plugins: [require("@tailwindcss/forms")],
  purge: ["./public/**/*.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      animation: {
        appear: "appear 1s",
      },
      keyframes: {
        appear: {
          "0%": { opacity: 0 },
          "50%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      minHeight: { 96: "24rem" },
    },
  },
  variants: {
    extend: {},
  },
}
