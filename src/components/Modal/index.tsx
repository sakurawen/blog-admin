import { AnimatePresence, motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';
import cx from 'classnames';
import { useColorMode } from '@chakra-ui/react';
import { Icon } from '@iconify/react';

type DialogProps = {
	open: boolean;
	onClose: () => void;
	className?: string;
	enableCloseButton?: boolean;
	maskClose?: boolean;
	loading?: boolean;
	title?: string;
	children: React.ReactNode;
};

/**
 * @returns
 */
export const Modal: React.FC<DialogProps> = (props) => {
	const {
		open,
		onClose,
		maskClose,
		children,
		title,
		loading,
		enableCloseButton,
		className,
	} = props;

	const { colorMode } = useColorMode();
	const isDark = colorMode === 'dark';

	const handleMaskClick = () => {
		!loading && maskClose && onClose();
	};

	const handleCloseModal = () => {
		!loading && onClose();
	};

	return (
		<AnimatePresence>
			{open && (
				<Dialog
					className='fixed inset-0 z-50'
					static
					as='div'
					open={open}
					onClose={onClose}
				>
					<motion.div
						transition={{
							duration: 0.1,
						}}
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
						}}
						exit={{
							opacity: 0,
						}}
						className='flex justify-center mx-2 items-center min-h-screen'
					>
						<div
							className={cx(
								'fixed inset-0 backdrop-blur',
								isDark ? 'bg-light-fading/10' : 'bg-dark-fading/20'
							)}
							onClick={handleMaskClick}
						></div>
						<motion.div
							transition={{
								duration: 0.2,
							}}
							initial={{
								opacity: 0,
								scale: 0.9,
							}}
							animate={{
								opacity: 1,
								scale: 1,
							}}
							exit={{
								opacity: 0,
								scale: 0,
							}}
							className={cx(
								'relative shadow-xl   bg-white dark:bg-dark  dark:text-white rounded p-6 text-black mx-auto w-96',
								className
							)}
						>
							{loading && (
								<motion.div
									transition={{}}
									initial={{
										opacity: 0,
									}}
									animate={{
										opacity: 1,
									}}
									exit={{
										opacity: 0,
									}}
									className='absolute inset-0 rounded h-full w-full backdrop-blur-md text-black text-base flex justify-center items-center z-20 bg-gray-100 dark:bg-dark-fading dark:text-gray-100'
								>
									<Icon
										icon={'eos-icons:loading'}
										className='align-middle mr-2 -ml-2'
									/>
									loading...
								</motion.div>
							)}
							{enableCloseButton && (
								<div
									onClick={handleCloseModal}
									className='float-right cursor-pointer transition-colors p-1 bg-transparent rounded hover:bg-gray-100 dark:hover:bg-dark-fading/70 dark:text-gray-200'
								>
									<XIcon className='w-5 h-5' />
								</div>
							)}
							{title && (
								<Dialog.Title className='text-xl mb-2 font-bold'>
									{title}
								</Dialog.Title>
							)}
							<div>{children}</div>
						</motion.div>
					</motion.div>
				</Dialog>
			)}
		</AnimatePresence>
	);
};

type ModalElementProps = {
	children?: React.ReactNode;
	className?: string;
};

export const ModalBody = (props: ModalElementProps) => {
	const { children, className } = props;
	return <div className={cx('mt-6', className)}>{children}</div>;
};

export const ModalFooter = (props: ModalElementProps & { flex?: boolean }) => {
	const { children, className, flex } = props;
	return (
		<div
			className={cx(
				'mt-6',
				{
					'flex items-center gap-2': flex,
				},
				className
			)}
		>
			{children}
		</div>
	);
};
