/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(299.12% 162.27% at 95.24% 76.53%, rgba(0, 0, 0, 1) 14.07%, #320084 100%)',
        'gradient-bright': 'linear-gradient(44deg, #4B00AA 0%, #A001EB 100%);'
      },
      colors: {
        pearl: {
          gray: '#F3F3F3',
          red: '#FE292A'
        }
      }
    },
  },
  plugins: [],
};
