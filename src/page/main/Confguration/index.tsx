import React from 'react';
import Row from '@/components/Row';
import { userActions } from '@/store/reducer/userSlice';
import { useDispatch } from 'react-redux';
import { SunIcon, MoonIcon } from '@heroicons/react/outline';
import cx from 'classnames';
import { motion } from 'framer-motion';
import { showNotification } from '@mantine/notifications';
import Success from '@/components/Icon/Success';

const Configuration: React.FC = () => {
	const dispatch = useDispatch();

	const handleSignOut = () => {
		dispatch(userActions.logout());
		showNotification({
			title: '退出登录',
      color:"blue",
			message: '',
			icon: <Success />,
		});
	};

	const handleChangeTheme = (theme: string) => {};

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
							'ring-theme-light '
						)}
						onClick={() => handleChangeTheme('light')}
					>
						<SunIcon className='w-4 h-4 inline-block mb-1 mr-1' /> Light
					</div>
					<div
						className={cx(
							' cursor-pointer select-none w-32 bg-dark ring-2 ring-transparent text-white py-4 rounded text-center'
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
