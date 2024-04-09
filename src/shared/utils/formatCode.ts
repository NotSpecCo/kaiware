import prettierHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';

export function formatCode(code: string, language: 'html' | 'json'): Promise<string> {
	return prettier.format(code, {
		parser: language,
		useTabs: false,
		tabWidth: 4,
		plugins: language === 'html' ? [prettierHtml] : []
	});
}
