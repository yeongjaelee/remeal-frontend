/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width:{
        '2xl':'612px'
      },
      height:{
        'xl':'400px',
        'xxl':'360px',
      },

    },

  },
  plugins: [],
};
