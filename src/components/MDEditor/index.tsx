import React, { useEffect, useRef } from 'react';
import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo } from 'prosemirror-history';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap ,toggleMark} from 'prosemirror-commands';
import { DOMParser } from 'prosemirror-model';
import '@/e.css';

const MDEditor = () => {
	const editorRef = useRef<HTMLDivElement>(null);
	const editorState = useRef<EditorState>();
	const editorView = useRef<EditorView>();

	/**
	 * init editor
	 */
	useEffect(() => {
		editorState.current = EditorState.create({
			doc: DOMParser.fromSchema(schema).parse(editorRef.current as HTMLDivElement),
			plugins: [
				history(),
				keymap(baseKeymap),
				keymap({
					'Mod-z': undo,
					'Mod-y': redo,
				}),
			],
		});
		editorView.current = new EditorView(editorRef.current as HTMLDivElement, {
			state: editorState.current,
		});
	}, []);

	const test = () => {
		console.log('test start');
		const { doc, schema } = editorState.current as EditorState;
		console.log(doc.toJSON(), schema);
	};

	return (
		<div>
			<h1>wuhu </h1>
			<div className='outline-none h-full' ref={editorRef}></div>
			<button onClick={test} className=' bg-blue-700 text-white py-2 px-12 rounded shadow'>
				test
			</button>
		</div>
	);
};

export default MDEditor;
