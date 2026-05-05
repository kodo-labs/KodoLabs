import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    include: ['../tests/unit/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
  },
})
