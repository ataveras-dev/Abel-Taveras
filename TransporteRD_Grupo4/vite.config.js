import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Rutas relativas para que funcione en GitHub Pages (https://usuario.github.io/transporterd/)
  base: './',
})
