module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      keyframes: {
        rotateSlow: { "0%": { transform: "rotate(0deg)" }, "100%": { transform: "rotate(360deg)" } },
        bounceSlow: { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-3px)" } },
        pulseSoft: { "0%, 100%": { transform: "scale(1)" }, "50%": { transform: "scale(1.05)" } },
        glow: { 
          "0%, 100%": { filter: "drop-shadow(0 0 3px #fff)" },
          "50%": { filter: "drop-shadow(0 0 6px #fff)" }
        }
      },
      animation: {
        rotateSlow: "rotateSlow 8s linear infinite",
        bounceSlow: "bounceSlow 2.5s ease-in-out infinite",
        pulseSoft: "pulseSoft 2s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite"
      }
    }
  },
  plugins: [],
};
