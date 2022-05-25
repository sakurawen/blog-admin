import { FC } from 'react';
const Error: FC<{ className?: string }> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className={className ? className : 'w-4 h-4'}
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			strokeWidth={2}
		>
			<path
				strokeLinecap='round'
				strokeLinejoin='round'
				d='M6 18L18 6M6 6l12 12'
			/>
		</svg>
	);
};

export default Error;
