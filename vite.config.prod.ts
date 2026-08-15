import { defineConfig, loadEnv, type UserConfigFnObject } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Production build config (separate filename to avoid Vercel's stale cache of
// vite.config.ts). No @babel/parser / source-tags import.
export default defineConfig(async ({ mode }) => {
  const plugins = [react(), tailwindcss()];

  const env = loadEnv(mode, process.cwd(), ['VITE_', 'NEXT_PUBLIC_']);
  const processEnvDefines: Record<string, string> = {};
  for (const [key, value] of Object.entries(env)) {
    processEnvDefines[`process.env.${key}`] = JSON.stringify(value);
  }

  return {
    plugins,
    envPrefix: ['VITE_', 'NEXT_PUBLIC_'],
    define: processEnvDefines,
    build: {
      minify: false,
      chunkSizeWarningLimit: 2000,
    },
  } as UserConfigFnObject;
})
