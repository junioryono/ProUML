const { colors } = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");
const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
   content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./ui/**/*.{ts,tsx}", "./content/**/*.{md,mdx}"],
   theme: {
      container: {
         center: true,
         padding: "1.5rem",
         screens: {
            "2xl": "1440px",
         },
      },
      extend: {
         fontFamily: {
            sans: ["Inter", ...fontFamily.sans],
         },
         colors: {
            ...colors,
            brand: {
               50: "#f3f3f3",
               100: "#e7e7e7",
               200: "#c4c4c4",
               300: "#a0a0a0",
               400: "#585858",
               500: "#111111",
               600: "#0f0f0f",
               700: "#0d0d0d",
               800: "#0a0a0a",
               900: "#080808",
               DEFAULT: "#111111",
            },
         },
         width: {
            "1/7": "14.285714285714285%",
         },
         animation: {
            "loading-bar": "",
         },
         keyframes: {
            "loading-bar": {
               "0%, 100%": {
                  "margin-left": "0%",
                  width: "50%",
               },
               "50%": {
                  // Make the start move to the right
                  "margin-left": "100%",
                  width: "0%",
               },
            },
         },
      },
   },
   plugins: [
      require("tailwindcss-animate"),
      require("@tailwindcss/typography"),
      plugin(function ({ addUtilities }) {
         addUtilities({
            ".no-scrollbar::-webkit-scrollbar": {
               display: "none",
            },
            ".no-scrollbar": {
               "-ms-overflow-style": "none",
               "scrollbar-width": "none",
            },
            ".border-b-1": {
               "border-bottom-width": "1px",
            },
            ".border-t-1": {
               "border-top-width": "1px",
            },
            ".border-l-1": {
               "border-left-width": "1px",
            },
            ".border-r-1": {
               "border-right-width": "1px",
            },
            ".bg-diagram-menu": {
               "background-color": "rgb(38 38 38)",
            },
            ".bg-diagram-menu-item-selected": {
               "background-color": "rgb(13 153 255)",
            },
            ".bg-diagram-menu-item-hovered": {
               "background-color": "rgb(17 17 17)",
            },
            // ".diagram-scrollbar": {
            //    overflow: "auto",
            //    "-ms-overflow-style": "none",
            //    "scrollbar-width": "none",
            //    "&::-webkit-scrollbar": {
            //       width: "14px",
            //       height: "14px",
            //    },
            //    "&::-webkit-scrollbar-track": {
            //       "background-clip": "padding-box",
            //       border: "solid transparent",
            //       "border-width": "1px",
            //    },
            //    "&::-webkit-scrollbar-thumb": {
            //       "background-color": "rgba(0, 0, 0, 0.1)",
            //       "background-clip": "padding-box",
            //       border: "solid transparent",
            //       "border-radius": "10px",
            //    },
            //    "&::-webkit-scrollbar-thumb:hover": {
            //       "background-color": "rgba(0, 0, 0, 0.4)",
            //    },
            //    "&::-webkit-scrollbar-corner": {
            //       "background-color": transparent,
            //    },
            // },
         });
      }),
   ],
};
