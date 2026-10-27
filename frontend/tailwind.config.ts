import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#16A34A", // Verde principal
          dark: "#166534",    // Verde oscuro
        },
        accent: {
          blue: "#1E3A8A",    // Azul profesional
        },
        bg: "#F8FAFC",        // Fondo general
        surface: "#FFFFFF",   // Tarjetas / Superficies
        text: {
          DEFAULT: "#0F172A", // Texto principal
        },
        border: "#E2E8F0",    // Bordes / Divisores
      },
    },
  },
  plugins: [],
};

export default config;
