module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        halmahera: ['Halmahera', 'sans-serif'],
        brightSunkiss: ['Bright Sunkiss', 'serif'],
        highSansSerif: ['High Sans Serif 7', 'sans-serif'],
      },
      animation: {
        'gradient': 'gradient-animation 5s ease infinite',
      },
      keyframes: {
        'gradient-animation': {
          '0%': {'background-position': '0% 50%'},
          '50%': {'background-position': '100% 50%'},
          '100%': {'background-position': '0% 50%'},
        },
      },
    },
  },
  plugins: [],
}
