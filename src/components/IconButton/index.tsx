import React from 'react';
import cx from 'classnames';
import { MouseEventHandler } from 'react';
import { Tooltip } from '@chakra-ui/react';

type IconButtonProps = {
	className?: string;
	style?: React.CSSProperties;
	onClick?: MouseEventHandler | undefined;
	tips?: string;
	variants?: 'default' | 'primary';
  children:React.ReactNode
};

/**
 * 图表按钮
 * @param props
 * @returns
 */
const IconButton: React.FC<IconButtonProps> = (props) => {
	const { children, className, style, onClick, tips, variants } = props;
	const isPrimary = variants === 'primary';
	return (
		<Tooltip placement='top' label={tips}>
			<button
				aria-label={tips}
				style={style}
				onClick={onClick}
				className={cx(
					!isPrimary &&
						'cursor-pointer p-2 mr-1 ring-2 hover:shadow rounded select-none dark:text-white hover:bg-light-fading ring-transparent hover:ring-light-deep dark:hover:ring-dark-fading  dark:hover:bg-dark dark:hover:text-white',
					isPrimary &&
						'cursor-pointer p-2 mr-1 ring-4 ring-transparent hover:ring-theme-light/20 dark:hover:ring-theme-dark/40  hover:shadow rounded select-none hover:shadow-theme-light/30 dark:hover:shadow-theme-dark/50 hover:bg-theme-light hover:text-white dark:hover:bg-theme-dark',
					className
				)}
			>
				{children}
			</button>
		</Tooltip>
	);
};

export default IconButton;
