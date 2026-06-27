import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#081225",
        navy: "#0f2747",
        steel: "#5f6f86",
        mist: "#eef3f8",
        sand: "#d6c4a0",
        line: "#d8e0ea"
      },
      fontFamily: {
        sans: ["Manrope", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["Georgia", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 24px 60px rgba(8, 18, 37, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(214,196,160,0.14), transparent 32%), linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0))"
      }
    }
  },
  plugins: []
};

export default config;
