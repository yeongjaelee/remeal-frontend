/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width:{
        '3xl': '840px',
        '2xl':'612px',
        'xl':'480px',
        '1.5xl':'540px'
      },
      height:{
        'xl':'400px',
        'xxl':'360px',
        '2xl':'640px'
      },

    },

  },
  plugins: [],
};
