import React from 'react';
import { Listbox } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { SelectorIcon } from '@heroicons/react/outline';

type OptionProps = {
	text: string;
	value: any;
};
type Options = OptionProps[];

type SelectProps<T = any> = {
	options: Options;
	value: T;
	onChange: (val: T) => void;
	placeholder?: string;
};

/**
 * 下拉选择
 * @returns
 */
const Select: React.FC<SelectProps> = (props) => {
	const { value, onChange, options, placeholder } = props;
	return (
		<div>
			<Listbox value={value} onChange={onChange}>
				{({ open }) => {
					return (
						<div className='relative bg-gray-50 rounded ring-1 ring-gray-200  dark:ring-dark dark:focus:ring-theme-dark-deep dark:bg-dark-fading focus-within:ring-2 dark:focus-within:ring-theme-dark focus-within:ring-theme-light'>
							<Listbox.Button className='relative p-2 flex items-center justify-between w-full text-left'>
								{value?.text ? (
									<span>{value?.text}</span>
								) : (
									<span className='text-gray-400 dark:text-gray-400'>{placeholder}</span>
								)}
								<SelectorIcon className='w-6 h-6 ' />
							</Listbox.Button>
							<AnimatePresence>
								{open && (
									<motion.div
										transition={{
											duration: 0.1,
										}}
										initial={{
											opacity: 0.4,
										}}
										animate={{
											opacity: 1,
										}}
										exit={{
											opacity: 0,
										}}
									>
										<Listbox.Options
											static
											className='absolute w-full space-y-1  overflow-hidden ring-1 ring-gray-100 shadow-lg p-1 rounded top-full left-0 bg-white dark:ring-gray-600 dark:bg-dark-fading'
										>
											{options.map((item) => {
												return (
													<Listbox.Option
														value={item}
														className='dark:hover:text-light hover:bg-light-fading dark:hover:bg-dark rounded transition-colors cursor-pointer'
														key={item.value}
													>
														{({ selected }) => {
															return selected ? (
																<div className='p-2 text-theme-light bg-theme-light-fading/5 dark:bg-theme-dark/10 rounded dark:text-theme-dark'>
																	{item.text}
																</div>
															) : (
																<div className='p-2'>{item.text}</div>
															);
														}}
													</Listbox.Option>
												);
											})}
										</Listbox.Options>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					);
				}}
			</Listbox>
		</div>
	);
};

export default Select;
