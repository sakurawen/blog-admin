import React from 'react';
import cx from 'classnames';
import { LoadingOutlined } from '@ant-design/icons';

type ButtonProps = {
	classNames?: string;
	disabled?: Boolean;
	loading?: boolean;
	variants?: ButtonType;
} & React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

type ButtonType = 'primary' | 'second';

const btnTheme = {
	primary:
		'bg-theme-light text-white  hover:bg-theme-light-deep dark:bg-theme-dark dark:text-white dark:hover:bg-theme-dark-deep ',
	second:
		'bg-gray-100 hover:bg-gray-200 text-gray-600 dark:bg-dark-fading dark:hover:bg-dark-deep/60 dark:text-white',
};

/**
 * 按钮
 * @param props
 * @returns
 */
const Button: React.FC<ButtonProps> = (props) => {
	const {
		disabled,
		classNames,
		children,
		onClick,
		loading,
		variants,
		...attr
	} = props;
	const btnVariants = variants === undefined ? 'primary' : variants;
	const disable = !!disabled;
	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (loading || disable) return;
		onClick && onClick(e);
	};
	return (
		<button
			{...attr}
			disabled={disable}
			onClick={handleClick}
			className={cx(
				'w-full rounded text-base py-2.5 px-2  transition-colors',
				btnTheme[btnVariants],
				classNames,
				{
					'!bg-theme-light/40 dark:!bg-theme-dark/20  !text-gray-200 shadow-gray-100 ':
						btnVariants === 'primary' && (disable || loading),
					'cursor-wait': loading,
					'cursor-not-allowed': disable,
				}
			)}
		>
			{loading && <LoadingOutlined className='align-middle mr-2 -ml-2' />}
			{children}
		</button>
	);
};

export default Button;
