module.exports = {
  content: [
    './renderer.jsx',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        resume: {
          primary: '#1A365D',
          secondary: '#2C5282',
          accent: '#C05621',
          text: '#2D3748',
          lightGray: '#718096',
          border: '#E2E8F0',
          headerBg: '#EDF2F7',
        }
      },
      fontFamily: {
        resume: ['InterVariable', 'Latin Modern Sans', 'sans-serif'],
      }
    }
  },
  plugins: []
}