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
        backgroundMain: "#F0F4F9",
        foreground: "var(--foreground)",
        gradientStart: "#00D4FF",
        gradientEnd: "#001BFF",

        horizontalLineColor: "#4285F4",
        searchbarColor: "#ECE6F0",
        searchbarTextColor: "#FFFFFF",
        selectedTextColor: "#4285F4",
        mainButtonColor: "#4285F4",
        mainButtonColorDisabled: "#A8C2E4",
        navbarColor: "#FFFFFF",
        navbarSelected: "#4285F4",
        darkButtonColor: "#1A73E8",
        darkButtonHover: "#63A4FF",
        darkButtonBorder: "#8AB4F8",
        productInventoryEditable: "#DCE8F6",
        productInventoryEditableBorder: "#4285F4",
      },
    },
  },
  plugins: [],
};
