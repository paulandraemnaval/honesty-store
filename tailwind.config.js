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
        gradientStart: "#02E2F2",
        gradientEnd: "#003CFF",
        horizontalLineColor: "#4285F4",
        searchbarColor: "#ECE6F0",
        searchbarTextColor: "#FFFFFF",
        selectedTextColor: "#4285F4",
        mainButtonColor: "#4285F4",
        mainButtonColorDisabled: "#A8C2E4",
        navbarColor: "#FFFFFF",
        navbarSelected: "#4285F4",
      },
    },
  },
  plugins: [],
};
