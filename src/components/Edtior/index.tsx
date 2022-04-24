import { $getRoot, $getSelection, EditorState } from 'lexical';
import { useEffect } from 'react';

import LexicalComposer from '@lexical/react/LexicalComposer';
import LexicalPlainTextPlugin from '@lexical/react/LexicalPlainTextPlugin';
import LexicalContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

// When the editor changes, you can get notified via the
// LexicalOnChangePlugin!
function onChange(editorState: EditorState) {
	editorState.read(() => {
		// Read the contents of the EditorState here.
		const root = $getRoot();
		const selection = $getSelection();
	});
}

// Lexical React plugins are React components, which makes them
// highly composable. Furthermore, you can lazy load plugins if
// desired, so you don't pay the cost for plugins until you
// actually use them.
function MyCustomAutoFocusPlugin() {
	const [editor] = useLexicalComposerContext();

	useEffect(() => {
		// Focus the editor when the effect fires!
		editor.focus();
	}, [editor]);

	return null;
}

function onError(error: Error) {
	console.error(error);
}

const Button = () => {
	const [editor] = useLexicalComposerContext();
	const show = () => {
		console.log(editor.getRootElement()?.textContent);
	};
	return <button onClick={show}>click me </button>;
};

function Editor() {
	const initialConfig = {
		onError,
	};
	return (
		<div className='py-4'>
			<LexicalComposer initialConfig={initialConfig}>
				<Button />
				<LexicalPlainTextPlugin
					contentEditable={
						<LexicalContentEditable className='p-4 outline-none border-none rounded-xl shadow h-96' />
					}
					placeholder={<div></div>}
				/>
				<LexicalOnChangePlugin onChange={onChange} />
				<HistoryPlugin />
				<MyCustomAutoFocusPlugin />
			</LexicalComposer>
		</div>
	);
}

export default Editor;
