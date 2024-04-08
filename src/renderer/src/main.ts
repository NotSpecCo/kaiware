import 'highlight.js/styles/stackoverflow-dark.css';
import './assets/main.css';

import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import hljs from 'highlight.js';
import hljsJson from 'highlight.js/lib/languages/json';
import hljsXml from 'highlight.js/lib/languages/xml';
import App from './App.svelte';

hljs.registerLanguage('json', hljsJson);
hljs.registerLanguage('html', hljsXml);

dayjs.extend(localizedFormat);

const app = new App({
	target: document.getElementById('app') as HTMLElement
});

export default app;
