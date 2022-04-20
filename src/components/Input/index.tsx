import React from 'react';
import cx from 'classnames';

type InputProps<T = any> = {
	value: T;
	onChange: (val: T) => void;
	className?: string;
	type?: 'text' | 'password';
	id?: string;
	disabled?: Boolean;
	placeholder?: string;
};

const Input:React.FC<InputProps> = (props) => {
	const { value, type, onChange, className, id, disabled, placeholder } = props;
	return (
		<div className={className}>
			<input
				placeholder={placeholder}
				value={value}
				id={id}
				disabled={!!disabled}
				spellCheck={false}
				onChange={(e) => onChange(e.target.value)}
				className={cx(
					'w-full p-2 bg-gray-50 accent-dark dark:accent-light caret-theme-light dark:caret-theme-dark focus:ring-theme-light focus:ring-2 rounded ring-gray-200  ring-1 border-none outline-none dark:ring-dark dark:focus:ring-theme-dark-deep dark:bg-dark-fading/60',
					{
						'cursor-not-allowed': disabled,
					}
				)}
				type={type ? type : 'text'}
			/>
		</div>
	);
};

export default Input;
