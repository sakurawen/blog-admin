import { Editor, Transforms, Range, Element } from 'slate';
import types from '../components/types';

const elementKeys = Object.keys(types);

// TODO:开发完成
export const withWYSIWYG = (editor: Editor) => {
	const { insertText, deleteBackward } = editor;
	editor.insertText = (text: string) => {
		const { selection } = editor;
		// Range.isCollapsed检查某个range是否重叠，即anchor=focus
		if (text === ' ' && selection && Range.isCollapsed(selection)) {
			const { anchor } = selection;
			// Editor.above 获取文档中节点的祖先节点
			const block = Editor.above(editor, {
				match: (n) => Editor.isBlock(editor, n),
			});
			const path = block ? block[1] : [];
			// Editor.start获取某个路径的起点
			const start = Editor.start(editor, path);
			// 获取 输入空格之前 的字符串，范围从标点位置至段落开头
			const range = { anchor, focus: start };
			const beforeText = Editor.string(editor, range) as keyof typeof types;
			console.log(beforeText);
			const type = types[beforeText];

			const typeProperties = { type };
			Transforms.setNodes<Element>(editor, typeProperties, {
				match: (n) => Editor.isBlock(editor, n),
			});

			if (type === 'list-item') {
				const listProperties = {
					type: 'bulleted-list',
					children: [],
				};
				Transforms.wrapNodes(editor, listProperties, {
					match: (n) => Editor.isEditor(n) && Element.isElement(n) && n.type === 'list-item',
				});
			}
		}
		insertText(text);
	};

	editor.deleteBackward = (...args) => {
		const { selection } = editor;
		if (selection) {
			const match = Editor.above(editor, {
				match: (n) => Editor.isBlock(editor, n),
			});

			if (match) {
				const { anchor } = selection;
				const [block, path] = match;
				console.log('block:', block, ',path:', path);
				const start = Editor.start(editor, path);
				const range = { anchor, focus: start };
				const beforeText = Editor.string(editor, range);
				const fmt = beforeText.slice(0, beforeText.length - 1);
				console.log('fmt:', fmt);
				if (!elementKeys.includes(fmt)) {
				}
			}
		}
		deleteBackward(...args);
	};

	return editor;
};
