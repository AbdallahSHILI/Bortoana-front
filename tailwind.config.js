module.exports = {
  content: ['./src/**/*.{html,js,ts,tsx,jsx}'],
  theme: {
    extend: {
      screens: {
        'smaller-1610': { max: '1610px' },
        'max-1350': { max: '1350px' }
      }
    }
  },
  plugins: []
}
