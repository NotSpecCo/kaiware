import prettierHtml from 'prettier/plugins/html';
import prettier from 'prettier/standalone';

export function formatCode(code: string, language: 'html' | 'json', spaces = 2): Promise<string> {
	return prettier.format(code, {
		parser: language,
		useTabs: false,
		tabWidth: spaces,
		plugins: language === 'html' ? [prettierHtml] : []
	});
}
