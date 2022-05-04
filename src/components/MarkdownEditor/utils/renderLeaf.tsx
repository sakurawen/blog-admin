import React from 'react';
import { RenderLeafProps } from 'slate-react';
import cx from 'classnames';
import { Icon } from '@iconify/react';

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
				'line-through': leaf.del,
				'text-rose-400 bg-rose-100 font-mono selection:bg-rose-400 selection:text-rose-200 py-1 px-2 rounded-md my-2 inline-flex items-center':
					leaf.bilibili,
				'bg-red-500 text-red-100 font-mono selection:bg-red-300 selection:text-red-500 py-1 px-2 rounded-md my-2 inline-flex items-center':
					leaf.netease,
				'text-theme-light dark:text-theme-dark font-bold': leaf.list,
				'text-theme-light dark:text-theme-dark/80 underline': leaf.url,
				'text-theme-light dark:text-theme-dark inline-block font-bold':
					leaf.blockquote,
			})}
			{...attributes}
		>
			{leaf.netease && (
				<Icon icon='ri:netease-cloud-music-fill' className='w-6 h-6 mr-1' />
			)}
			{leaf.bilibili && (
				<Icon icon='ri:bilibili-fill' className='w-6 h-6 mr-1' />
			)}
			{children}
		</span>
	);
};

export default renderLeaf;
