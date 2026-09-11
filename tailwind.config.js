/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF7F1",
        creamsoft: "#F5EEE2",
        ink: "#211F1C",
        inksoft: "#5B5750",
        sage: "#8CB9AA",
        sagedark: "#5E9280",
        amber: "#E8A33D",
        amberdark: "#C4801F",
        blush: "#EFDFCB",
        whatsapp: "#25D366",
        whatsappdark: "#1DA851",
        line: "#E4DACB",
      },
      fontFamily: {
        heading: ["Fredoka", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
};
