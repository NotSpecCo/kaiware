import 'highlight.js/styles/stackoverflow-dark.css';
import './assets/main.css';

import App from './App.svelte';

const app = new App({
	target: document.getElementById('app') as HTMLElement
});

export default app;
