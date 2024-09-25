import type { Config } from "tailwindcss";

export default <Partial<Config>>{
  theme: {
    extend: {
      colors: {
        "red-red": {
          50: "#ffebee",
          100: "#ffcdd2",
          200: "#ef9a9a",
          300: "#e57373",
          400: "#ef5350",
          500: "#f44336", // 기본 red-red 색상
          600: "#e53935",
          700: "#d32f2f",
          800: "#c62828",
          900: "#b71c1c",
        },
      },
    },
  },
};
