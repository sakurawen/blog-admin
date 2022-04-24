import { Node, Path, Range, Text } from 'slate';
import Prism from 'prismjs';
{/* <NeteaseMusic aid="381962" type="2"/> */}
Prism.languages.markdown = Prism.languages.extend('markup', {});
Prism.languages.insertBefore('markdown', 'prolog', {
	blockquote: { pattern: /^>(?:[\t ]*>)*/m, alias: 'punctuation' },
	code: [{ pattern: /`.+?`/, alias: 'keyword' }],
	bilibili: [{ pattern: /<Bilibili\s+bv=".+"\s*\/>/, alias: 'keyword' }],
	netease: [{ pattern: /<NeteaseMusic\s+aid=".+"\s*type="[0-9]"\s*\/>/, alias: 'keyword' }],
	title: [
		{
			pattern: /(^\s*)#{1,6}.+/m,
			lookbehind: !0,
			alias: 'important',
			inside: { punctuation: /^#+|#+$/ },
		},
	],
	hr: {
		pattern: /(^\s*)([*-])([\t ]*\2){2,}(?=\s*$)/m,
		lookbehind: !0,
		alias: 'punctuation',
	},
	list: {
		pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].*)/m,
		lookbehind: !0,
		alias: 'punctuation',
	},
	'url-reference': {
		pattern:
			/!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
		inside: {
			variable: { pattern: /^(!?\[)[^\]]+/, lookbehind: !0 },
			string: /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
			punctuation: /^[[\]!:]|[<>]/,
		},
		alias: 'url',
	},
	del: {
		pattern: /(^|[^\\])(~~)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?~~/,
		lookbehind: !0,
		inside: { punctuation: /^[~]|[~]$/ },
	},
	bold: {
		pattern: /(^|[^\\])(\*\*|__)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\2/,
		lookbehind: !0,
		inside: { punctuation: /^\*\*|^__|\*\*$|__$/ },
	},
	italic: {
		pattern: /(^|[^\\])(\s\*)(?:(?:\r?\n|\r)(?!\r?\n|\r)|.)+?\*\s/,
		lookbehind: !0,
		inside: { punctuation: /^[*]|[*]$/ },
	},
	url: {
		pattern: /(?<=(?:!?)\[(.+)\]\().+(?=\))/,
		inside: {
			variable: { pattern: /(!?\[)[^\]]+(?=\]$)/, lookbehind: !0 },
			string: { pattern: /"(?:\\.|[^"\\])*"(?=\)$)/ },
		},
	},
});

const markdownDecorate = ([node, path]: [Node, Path]) => {
	const ranges: Range[] = [];

	if (!Text.isText(node)) {
		return ranges;
	}

	const getLength = (token: string | Prism.Token): number => {
		if (typeof token === 'string') {
			return token.length;
		} else if (typeof token.content === 'string') {
			return token.content.length;
		} else if (token.content instanceof Array) {
			return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
		}
		return 0;
	};

	const tokens = Prism.tokenize(node.text, Prism.languages.markdown);

	let start = 0;

	for (const token of tokens) {
		const length = getLength(token);
		const end = start + length;
		if (typeof token !== 'string') {
			ranges.push({
				[token.type]: true,
				anchor: { path, offset: start },
				focus: { path, offset: end },
			});
		}
		start = end;
	}

	return ranges;
};

export default markdownDecorate;
