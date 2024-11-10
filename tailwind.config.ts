import type { Config } from "tailwindcss";
import colors from 'tailwindcss/colors';


export default {
  content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
      colors: {
        error: colors.red[600],
        gold: '#fdb532',
        'gold-100': '#fff7ea',
        primary: '#dbeafe',
        success: colors.green[600],
        warning: colors.yellow[400],
      },
    },
  },
  plugins: [],
} satisfies Config;
