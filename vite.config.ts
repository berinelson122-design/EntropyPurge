import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

/**
 * VOID_WEAVER // VITE_CONFIG
 * OPTIMIZED FOR: APPLE_M2_SILICON
 */
export default defineConfig({
    plugins: [
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        port: 3000,
        host: true,
        strictPort: true,
    },
    build: {
        outDir: 'dist',
        minify: 'terser', // Highest compression for production
        terserOptions: {
            compress: {
                drop_console: true, // Clean logs for distribution
                drop_debugger: true,
            },
        },
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser'], // Split heavy engine from UI logic
                    react: ['react', 'react-dom'],
                },
            },
        },
    },
});