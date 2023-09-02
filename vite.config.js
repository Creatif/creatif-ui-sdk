import {resolve, join} from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

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
		}
	},
	build: {
		sourcemap: true,
		lib: {
			// Could also be a dictionary or array of multiple entry points
			entry: resolve(__dirname, 'src/index.tsx'),
			name: 'creatif-ui-sdk',
			// the proper extensions will be added
			fileName: 'my-lib',
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