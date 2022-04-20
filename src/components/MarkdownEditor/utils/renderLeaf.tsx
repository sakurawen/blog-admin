import React from 'react';
import { RenderLeafProps } from 'slate-react';
import cx from 'classnames';

const renderLeaf = (props: RenderLeafProps) => {
	const { children, leaf, attributes } = props;
	return (
		<span
			className={cx({
				'text-xl  font-bold mb-2 inline-block leading-relaxed': leaf.title,
				'py-0.5 font-mono px-1 mx-0.5  bg-theme-light/20 text-theme-light-deep dark:bg-theme-dark-light/20 dark:text-theme-dark rounded ':
					leaf.code,
				italic: leaf.italic,
				'font-bold': leaf.bold,
        "line-through":leaf.del,
				'text-theme-light dark:text-theme-dark font-bold': leaf.list,
				'text-theme-light dark:text-theme-dark/80 underline': leaf.url,
				'text-theme-light dark:text-theme-dark inline-block font-bold':
					leaf.blockquote,
			})}
			{...attributes}
		>
			{children}
		</span>
	);
};

export default renderLeaf;
