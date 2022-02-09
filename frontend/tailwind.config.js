const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  safelist: [
    {
      pattern: /^button--size*/,
      variants: ['lg', 'md', 'sm'],
    }
  ],
  theme: {
    extend: {
      colors: {
        // https://tailwindcss.com/docs/background-color
        // blue-800
        brand_primary: "#E0C3FC73",
        // fuchsia-800
        brand_secondary: "#72419F",
        // red-600
        brand_tertiary: "#D7B1FC",
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
        '2xl': "5rem",
        '3xl': "6rem",
        "-xs": "-0.5rem",
        "-sm": "-1rem",
        "-base": "-2rem",
        "-md": "-3rem",
        "-xl": "-4rem",
        '-2xl': "-5rem",
        '-3xl': "-6rem",
      },
      animation: {
        'spin-reverse': 'spinreverse 1s linear infinite',
      },
      keyframes: {
        spinreverse: {
          from: {
            transform: 'rotate(360deg)'
          }
        }
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
