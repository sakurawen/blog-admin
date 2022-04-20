import React from 'react';
import Row from '@/components/Row';
import { useColorMode } from '@chakra-ui/react';
import { userActions } from '@/store/reducer/userSlice';
import { useDispatch } from 'react-redux';
import { useToast } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';
import cx from 'classnames';
import { motion } from 'framer-motion';

const Configuration:React.FC = () => {
	const { colorMode, setColorMode } = useColorMode();
	const dispatch = useDispatch();
	const isDark = colorMode === 'dark';
	const toast = useToast();

	const handleSignOut = () => {
		dispatch(userActions.logout());
		toast({
			status: 'info',
			title: '退出登录',
			position: 'top',
			duration: 1500,
		});
	};

	const handleChangeTheme = (theme: string) => {
		setColorMode(theme);
	};

	return (
		<motion.div
			initial={{
				opacity: 0,
				translateX: 10,
			}}
			animate={{
				opacity: 1,
				translateX: 0,
			}}
		>
			<h1 className='text-2xl pl-2 font-bold'>Setting</h1>
			<div className='mt-6'>
				<h2 className='pl-4 text-base'>切换模式</h2>
				<div className='flex gap-2 px-4 my-4'>
					<div
						className={cx(
							' cursor-pointer select-none w-32 bg-light ring-2 ring-transparent text-dark py-4 rounded text-center',
							{
								'ring-theme-light ': !isDark,
							}
						)}
						onClick={() => handleChangeTheme('light')}
					>
						<SunIcon className='w-4 h-4 inline-block mb-1 mr-1' /> Light
					</div>
					<div
						className={cx(
							' cursor-pointer select-none w-32 bg-dark ring-2 ring-transparent text-white py-4 rounded text-center',
							{
								'ring-theme-dark-light': isDark,
							}
						)}
						onClick={() => handleChangeTheme('dark')}
					>
						<MoonIcon className='w-4 h-4 inline-block mb-1 mr-1' />
						Dark
					</div>
				</div>
				<Row onClick={handleSignOut}>退出登录</Row>
			</div>
		</motion.div>
	);
};

export default Configuration;
