import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      animation: { float: "float 6s ease-in-out infinite", "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite", glow: "glow 2s ease-in-out infinite alternate" },
      keyframes: {
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-20px)" } },
        glow: { "0%": { boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)" }, "100%": { boxShadow: "0 0 40px rgba(236, 72, 153, 0.6)" } },
      },
    },
  },
  plugins: [],
};
export default config;
