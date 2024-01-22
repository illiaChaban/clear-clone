/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    ({ addUtilities }) => {
      addUtilities({
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          }
        },
        // '.animation-reversed': {
        //   'animation-direction': 'reverse',
        // },
        // '.animation-paused': {
        //   'animation-play-state': 'paused',
        // }
        '.all-unset': {
          all: 'unset'
        },
        '.all-inherit': {
          all: 'inherit',
        }
      });
    }
  ],
  experimental: {
    optimizeUniversalDefaults: true
  }
}

