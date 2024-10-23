/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        gradientStart: "#0E572E",
        gradientMiddle: "#0C6435",
        gradientEnd: "#114B27",
        customerRibbonGreen: "#146939",
        navbarGreen: "#17321A",
        yellow: "#fdc530",
      },
    },
  },
  plugins: [],
};
