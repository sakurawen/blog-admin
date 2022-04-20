import React from 'react';
import cx from 'classnames';
import { SearchIcon } from '@heroicons/react/outline';

type SearchProps<T = any> = {
	value: T;
	onChange: (val: T) => void;
	className?: string;
};

/**
 * 搜索条
 * @param props
 * @returns
 */
const Search: React.FC<SearchProps> = (props) => {
	const { value, onChange, className } = props;
	return (
		<div className={cx('mb-4 relative', className)}>
			<SearchIcon className='text-dark-fading/60 dark:text-light-deep/80 w-5 h-5 absolute top-3 left-3' />
			<input
				className={cx(
					'bg-light-deep/40 dark:bg-dark-fading/40 ring-inset   p-2 pl-10 w-full rounded text-base border-noneo outline-none',
					'focus:ring-2 ring-theme-light dark:ring-theme-dark'
				)}
				type='text'
				placeholder='search...'
				spellCheck={false}
				maxLength={60}
				value={value}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	);
};

export default Search;
