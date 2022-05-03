import Highlight, { defaultProps, Language } from 'prism-react-renderer';
import light from "prism-react-renderer/themes/github"

interface CodeProps {
	className: string;
	children: string;
}
const Code = (props: unknown) => {
	const className: string = (props as CodeProps).className;
	if (!className) {
		return (
			<code
				{...props}
				className='bg-gray-200 text-gray-700 font-mono dark:bg-zinc-700 dark:text-slate-200 px-1 rounded'
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
