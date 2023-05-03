/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      width:{
        '38':'152px',
        '3xl': '840px',
        '2xl':'640px',
        'xl':'480px',
        '1.5xl':'540px',
        '5xl': '1200px',
        'mainLayout':'1025.5px',
        'listOnTag':'71px',
      },
      height:{
        '4.5': '18px',
        'xl':'400px',
        'xxl':'360px',
        '1.2xl':'464px',
        '1.5xl':'512px',
        '2xl':'640px',
        '3xl':'800px',
        '5xl':'1500px'
      },
      leading:{
        '4.5':'18px',
      }
    },
    fontFamily: {
      'NanumSquareNeoOTF-rg': ['NanumSquareNeoOTF-Rg', 'sans-serif'],
    },
    fontSize:{
      'xxs':'10px',
      'xs':'12px',
      'lg':'18px',
      'xl':'20px',
      'base':'16px',
      '2xl':'24px',
      '3xl':'30px',
      'x':'14px'
    },
    textUnderlineOffset: {
      3: '3px',
    }

  },
  plugins: [],
};
