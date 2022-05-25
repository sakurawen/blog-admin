import { FC } from 'react';
const Success: FC<{ className?: string }> = ({ className }) => {
	return (
		<svg
			xmlns='http://www.w3.org/2000/svg'
			className={className ? className : 'h-4 w-4'}
			fill='none'
			viewBox='0 0 24 24'
			stroke='currentColor'
			strokeWidth={2}
		>
			<path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' />
		</svg>
	);
};

export default Success;
