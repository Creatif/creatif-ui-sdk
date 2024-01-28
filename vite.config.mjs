import path, { resolve, join } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
        }),
    ],
    resolve: {
        alias: {
            '@app': join(__dirname, 'src/app'),
            '@lib': join(__dirname, 'src/lib'),
            '@root': join(__dirname, 'src/'),
        },
    },
    build: {
        minify: true,
        lib: {
            // Could also be a dictionary or array of multiple entry points
            entry: [resolve(__dirname, 'src/CreatifProvider.tsx')],
            name: 'creatif-ui-sdk',
            // the proper extensions will be added
            fileName: 'creatif',
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react', 'react-dom'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'react',
                    'react-dom': 'react-dom',
                },
            },
        },
        outDir: 'build',
    },
});
