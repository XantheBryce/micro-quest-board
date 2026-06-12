import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        baseblue: "#0052ff",
        ink: "#171717",
        mint: "#2fd6a3",
        amberline: "#f5a524",
      },
      boxShadow: {
        panel: "0 14px 40px rgba(23, 23, 23, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
