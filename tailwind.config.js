/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Estos colores leen variables CSS (definidas en src/index.css) para poder
        // cambiar entre el tema normal y el tema Black Friday sin tocar componentes.
        cream: "rgb(var(--c-cream) / <alpha-value>)",
        creamsoft: "rgb(var(--c-creamsoft) / <alpha-value>)",
        ink: "rgb(var(--c-ink) / <alpha-value>)",
        inksoft: "rgb(var(--c-inksoft) / <alpha-value>)",
        sage: "rgb(var(--c-sage) / <alpha-value>)",
        sagedark: "rgb(var(--c-sagedark) / <alpha-value>)",
        amber: "rgb(var(--c-amber) / <alpha-value>)",
        amberdark: "rgb(var(--c-amberdark) / <alpha-value>)",
        blush: "rgb(var(--c-blush) / <alpha-value>)",
        line: "rgb(var(--c-line) / <alpha-value>)",
        onsage: "rgb(var(--c-onsage) / <alpha-value>)",
        onamber: "rgb(var(--c-onamber) / <alpha-value>)",
        whatsapp: "#25D366",
        whatsappdark: "#1DA851",
      },
      fontFamily: {
        heading: ["Fredoka", "sans-serif"],
        body: ["Inter", "sans-serif"],
        display: ["Anton", "Impact", "sans-serif"],
      },
      borderRadius: {
        card: "20px",
      },
    },
  },
  plugins: [],
};
