import { svelte } from '@sveltejs/vite-plugin-svelte';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import path from 'node:path';
import Icons from 'unplugin-icons/vite';

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		resolve: {
			alias: {
				$main: path.resolve(__dirname, './src/main'),
				$preload: path.resolve(__dirname, './src/preload'),
				$types: path.resolve(__dirname, './src/types')
			}
		}
	},
	preload: {
		plugins: [externalizeDepsPlugin()]
	},
	renderer: {
		plugins: [svelte(), Icons({ compiler: 'svelte' })],
		resolve: {
			alias: {
				$: path.resolve(__dirname, './src/renderer/src'),
				$lib: path.resolve(__dirname, './src/renderer/src/lib'),
				$types: path.resolve(__dirname, './src/types')
			}
		}
	}
});
