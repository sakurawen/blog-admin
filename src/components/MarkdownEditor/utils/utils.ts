import { Descendant, Editor, Node, Transforms } from 'slate';
/**
 * 将编辑器内容解析成字符串
 * @param val
 * @returns
 */
export const serializeEditContent = (val: Descendant[]) => {
	return val
		.map((node) => {
			return Node.string(node);
		})
		.join('\n');
};

/**
 * 字符串解析到编辑器
 * @param str
 * @returns
 */
export const deserializeEditContent = (str: string = ''): Descendant[] =>
	str.split('\n').map((line) => {
		return {
			type: 'paragraph',
			children: [{ text: line }],
		};
	});

/**
 * 检查是否粗体字符串
 */
export const isBoldText = (str: string) => {
	const reg = /^\*\*(.*?)\*\*$/;
	return reg.test(str);
};

/**
 * 设置粗体
 * @param str
 */
export const setBold = (str: string) => {
	return `**${str}**`;
};

export const recoverBold = (str: string) => {
	const reg = /^\*\*(.*?)\*\*$/;
	const match = str.match(reg);
	if (match !== null) {
		return match[1];
	}
	return str;
};

/**
 * 检查是否斜体字符串
 */
export const isItalicText = (str: string) => {
	const reg = /^(?:\s?)\*(.*?)\*(?:\s?)$/;
	return reg.test(str);
};

/**
 * 设置斜体
 * @param str
 */
export const setItalic = (str: string) => {
	return ` *${str}* `;
};

/**
 * 从斜体中恢复
 * @param str
 */
export const recoverItalic = (str: string) => {
	const reg = /^(?:\s)?\*(.*?)\*(?:\s)?$/;
	const match = str.match(reg);
	if (match !== null) {
		return match[1];
	}
	return str;
};

/**
 * 是否为划线删除
 * @param str
 * @returns
 */
export const isDeleteText = (str: string) => {
	const reg = /\s?~(.*?)~\s?/;
	return reg.test(str);
};

/**
 * 设置中划线
 * @param str
 */
export const setDelete = (str: string) => {
	return `~~${str}~~`;
};

/**
 * 从划线中恢复
 * @param str
 */
export const recoverDelete = (str: string) => {
	const reg = /~~(.*?)~~?/;
	const match = str.match(reg);
	if (match !== null) {
		return match[1];
	}
	return str;
};

/**
 * 判断是否只有一个fragment
 * @param f
 * @returns
 */
export const isHasOneFragment = (f: Descendant[]) => {
	return f.length === 1;
};

/**
 * 改变单行Text
 */
export const nodeTextFormat = (editor: Editor, fmt: string) => {
	const _fmt = fmt.toLocaleLowerCase();
	const fregment = editor.getFragment();
	if (isHasOneFragment(fregment)) {
		let text = Node.string(fregment[0]);
		switch (_fmt) {
			case 'b':
				/** bold */
				if (isBoldText(text)) {
					text = recoverBold(text);
				} else {
					text = setBold(text);
				}
				break;
			case 'i':
				/** italic */
				if (isItalicText(text)) {
					text = recoverItalic(text);
				} else {
					text = setItalic(text);
				}
				break;
			case 'd':
				if (isDeleteText(text)) {
					text = recoverDelete(text);
				} else {
					text = setDelete(text);
				}
				break;
		}
		Transforms.insertText(editor, text);
	}
};

const unSupportMediaError = new Error('不支持该媒体');

/**
 * 解析媒体URL
 * @param url
 */
export const getMediaComponentStr = (url: string) => {
	const biliiliUrlRegexp = /https:\/\/www.bilibili.com\/video\/.+/;
	const NeteaseMusicRegexp = /https\:\/\/music.163.com\/#\/song\?id=.+/;
	const isBilibiliUrl = biliiliUrlRegexp.test(url);
	const isNeteaseMusicUrl = NeteaseMusicRegexp.test(url);
	try {
		const _url = new URL(url);
		const pathname = _url.pathname;
		if (isBilibiliUrl) {
			const bv = getBV(pathname);
			return `<Bilibili bv="${bv}"/>`;
		}
		if (isNeteaseMusicUrl) {
			const ret = getAidAndType(_url.hash);
			return `<NeteaseMusic aid="${ret.aid}" type="${ret.type}"/>`;
		}
		throw unSupportMediaError;
	} catch (e) {
		if (e === unSupportMediaError) {
			throw new Error((e as Error).message);
		}
		throw new Error('解析错误');
	}
};

const getBV = (pathname: string) => {
	const reg = /\/video\/(.+)/;
	const ret = pathname.match(reg);
	if (ret !== null) {
		return ret[1];
	}
	return '';
};

const getAidAndType = (hash: string) => {
	const songReg = /#\/song\?id=(.*)/;
	const playListReg = /#\/playlist\?id=(.*)/;
	const songRet = hash.match(songReg);
	const playListRet = hash.match(playListReg);
	console.log(songRet, playListRet);
	let t = 0;
	let ret = null;
	if (songRet) {
		t = 2;
		ret = songRet;
	}
	if (playListRet) {
		t = 0;
		ret = playListRet;
	}
	if (ret !== null) {
		return {
			aid: ret[1],
			type: t,
		};
	}
	return {
		aid: '381962',
		type: 2,
	};
};
