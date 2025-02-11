import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from "path";

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/main.tsx'],
            refresh: true,
        }),
        react(),
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
        alias: {
            '@': path.resolve(__dirname, './resources/js')
        }
    },
});