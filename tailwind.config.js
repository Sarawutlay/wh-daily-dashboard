/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B1D3A",
        dock: {
          50: "#EEF3FA",
          100: "#D9E4F4",
          200: "#B3C9E8",
          300: "#7FA3D6",
          400: "#4A78BE",
          500: "#28558F",
          600: "#1B3F6E",
          700: "#152F52",
          800: "#0F2140",
          900: "#0A162E",
        },
        rust: "#C4622D",
        amber: "#D99A2B",
        moss: "#3E7A4C",
        clay: "#B23A34",
        paper: "#F5F2EA",
      },
      fontFamily: {
        display: ["'Space Grotesk'", "'Noto Sans Thai'", "sans-serif"],
        body: ["'Noto Sans Thai'", "'Space Grotesk'", "sans-serif"],
      },
      boxShadow: {
        panel: "0 1px 0 rgba(10,22,46,0.06), 0 8px 24px -12px rgba(10,22,46,0.25)",
      },
      backgroundImage: {
        crate:
          "repeating-linear-gradient(45deg, rgba(255,255,255,0.035) 0, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 10px)",
      },
    },
  },
  plugins: [],
};
