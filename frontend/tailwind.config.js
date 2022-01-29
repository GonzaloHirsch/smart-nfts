const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // @deprecated
      backgroundImage: {
        custom_gradient_1: "url('@/assets/images/bg-gradient-1.svg')",
        custom_gradient_2: "url('@/assets/images/bg-gradient-2.svg')",
        custom_gradient_3: "url('@/assets/images/bg-gradient-3.svg')",
      },
      colors: {
        // https://tailwindcss.com/docs/background-color
        // blue-800
        brand_primary: "rgb(30 64 175)",
        // fuchsia-800
        brand_secondary: "rgb(134 25 143)",
        // red-600
        brand_tertiary: "rgb(220 38 38)",
        typography_primary: "#FFFFFF",
        typography_secondary: "#333333",
        light: "#F4F4F4",
        disabled: "#F4F4F4",
        error: "#FF4040",
        success: "#66D972"
      },
      fontFamily: {
        text: ['Open Sans', 'Helvetiva'],
        highlight: ['Inter', 'Helvetiva']
      },
      fontSize: {
        body_xs: "0.75rem",
        body: "1rem",
        body_xl: "1.25rem",
        h5: "1.5rem",
        h4: "2rem",
        h3: "2.5rem",
        h2: "3rem",
        h1: "4rem"
      },
      // Used in margin, padding, width, height
      spacing: {
        xs: "0.5rem",
        sm: "1rem",
        base: "2rem",
        md: "3rem",
        xl: "4rem",
        "-xs": "-0.5rem",
        "-sm": "-1rem",
        "-base": "-2rem",
        "-md": "-3rem",
        "-xl": "-4rem",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
