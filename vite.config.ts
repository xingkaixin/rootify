import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'

export default defineConfig(({ mode }) => {
  const packageJson = JSON.parse(readFileSync('./package.json', 'utf-8'))
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(packageJson.version)
    },
    server: {
      port: 3000,
      host: true
    }
  }
})