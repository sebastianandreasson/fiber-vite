import macrosPlugin from 'vite-plugin-babel-macros'

export default {
  server: {
    host: '0.0.0.0',
  },
  plugins: [macrosPlugin()],
}
