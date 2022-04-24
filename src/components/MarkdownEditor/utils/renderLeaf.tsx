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
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-5 w-5 mr-1 inline'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					strokeWidth={2}
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3'
					/>
				</svg>
			)}
			{leaf.bilibili && (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6 mr-1 inline'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					strokeWidth={2}
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
					/>
				</svg>
			)}
			{children}
		</span>
	);
};

export default renderLeaf;
