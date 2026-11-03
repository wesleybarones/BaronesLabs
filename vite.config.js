import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // INLINE=1 embute imagens no bundle (usado para gerar o HTML único da prévia)
  build: { assetsInlineLimit: process.env.INLINE ? 100_000_000 : 4096 },
})
