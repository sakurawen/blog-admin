import React from 'react';
import { ArrowUpIcon, PaperClipIcon } from '@heroicons/react/outline';
import cx from 'classnames';

type ToobarProps = {
	className?: string;
};

const Toobar: React.FC<ToobarProps> = (props) => {
	const { className } = props;
	const handleScrollTop = () => {
		window.scrollTo(0, 0);
	};
	return (
		<div
			className={cx(
				'fixed bottom-4 right-4 md:opacity-25 md:hover:opacity-100 transition-opacity',
				className
			)}
		>
			<div className='flex flex-col  bg-white dark:bg-dark-fading shadow ring-inset  rounded'>
				<div className='md:block hidden p-2 md:p-4 rounded overflow-hidden bg-white dark:bg-dark-fading dark:hover:bg-dark hover:bg-gray-100 cursor-pointer'>
					<PaperClipIcon className='w-6 h-6' />
				</div>
				<div
					onClick={handleScrollTop}
					className='p-2 md:p-4 rounded overflow-hidden bg-white dark:bg-dark-fading dark:hover:bg-dark hover:bg-gray-100 cursor-pointer'
				>
					<ArrowUpIcon className='w-6 h-6' />
				</div>
			</div>
		</div>
	);
};

export default Toobar;
