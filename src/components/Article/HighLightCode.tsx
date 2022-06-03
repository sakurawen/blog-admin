import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import light from 'prism-react-renderer/themes/github';

interface CodeProps {
	className: string;
	children: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Code = (props: any) => {
	const className: string = (props as CodeProps).className;
	if (!className) {
		return (
			<code
				{...props}
				className='bg-blue-100   text-blue-600 font-mono mx-0.5 dark:bg-zinc-700 dark:text-slate-200 px-1 py-0.5 rounded'
			/>
		);
	}
	const lang = className.replace('lang-', '') as Language;
	return (
		<Highlight
			code={(props as CodeProps).children.trim()}
			language={lang}
			{...defaultProps}
			theme={light}
		>
			{({ className, style, tokens, getLineProps, getTokenProps }) => {
				return (
					<pre className={`p-4 rounded-md ${className}`} style={style}>
						{tokens.map((line, i) => (
							<div key={i} {...getLineProps({ line })}>
								{line.map((token, key) => (
									<span key={key} {...getTokenProps({ token })} />
								))}
							</div>
						))}
					</pre>
				);
			}}
		</Highlight>
	);
};

export default Code;
