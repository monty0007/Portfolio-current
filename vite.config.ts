import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        target: 'es2020',
        cssCodeSplit: true,
        sourcemap: false,
        chunkSizeWarningLimit: 800,
        rollupOptions: {
          output: {
            // Split heavy third-party deps into their own chunks so they
            // don't block the initial paint on mobile networks.
            manualChunks: (id) => {
              if (!id.includes('node_modules')) return undefined;
              if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
              if (id.includes('@google/genai')) return 'vendor-genai';
              if (id.includes('@emailjs')) return 'vendor-email';
              if (id.includes('@libsql')) return 'vendor-db';
              // Keep react, react-dom, react-router, and scheduler together to avoid
              // chunk initialization order issues with React 19 Activity API.
              if (id.includes('react-router') || id.includes('react-dom') || id.includes('react/') || id.includes('scheduler')) return 'vendor-react';
              return 'vendor';
            },
          },
        },
      },
    };
});
