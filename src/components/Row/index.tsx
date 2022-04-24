import React, { ReactNode } from 'react';
import cx from 'classnames';

type RowProps = {
	className?: string;
	onClick?: React.MouseEventHandler<HTMLDivElement>;
	ariaLabel?: string;
  children:ReactNode
};
/**
 * 一行
 * @returns
 */
const Row: React.FC<RowProps> = (props) => {
	const { onClick, children, className, ariaLabel } = props;
	return (
		<div
			role='link'
			aria-label={ariaLabel}
			onClick={onClick}
			className={cx(
				'px-4 ring-2 ring-transparent  py-2.5 hover:bg-light-fading/80 dark:hover:bg-dark rounded cursor-pointer',
				className
			)}
		>
			{children}
		</div>
	);
};

export default Row;
