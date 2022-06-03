import classNames from 'classnames';
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { CubeTransparentIcon, ViewListIcon } from '@heroicons/react/outline';
import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { userActions } from '@/store/reducer/userSlice';
import { showNotification } from '@mantine/notifications';
import Success from '../Icon/Success';

export const menu = [
	{
		path: '/',
		text: 'Node',
		desc: '节点',
		icon: CubeTransparentIcon,
	},
	{
		path: 'posts',
		text: 'Posts',
		desc: '文章',
		icon: ViewListIcon,
	},
];

// type Lang = 'zh' | 'en' | 'jp';

type MenuProps = {
	className?: string;
};

/**
 * 导航条
 * @returns
 */
const Menu: React.FC<MenuProps> = (props) => {
	const { className } = props;
	const dispatch = useDispatch();

	const logout = () => {
		dispatch(userActions.logout());
		showNotification({
			message: '退出成功',
			color: 'blue',
			icon: <Success />,
		});
	};

	return (
		<div className='hidden sm:block select-none w-64 flex-shrink-0   relative z-30 '>
			<div
				className={cx(
					'flex flex-col w-64 pt-6 pr-2 h-full bg-white dark:bg-dark fixed top-0 border-r border-dark/5 dark:border-light/5',
					className
				)}
			>
				<div className='pl-6'>
					<Link
						className={cx(
							'text-2xl  font-bold flex   items-center text-transparent bg-clip-text bg-gradient-to-br',
							' from-theme-light  via-theme-light/80 to-theme-light-fading',
							'dark:from-theme-dark dark:to-rose-400'
						)}
						to=''
					>
						<img
							src={require('@/assets/logo.png')}
							className='w-12 h-12 mr-4'
							alt='menu logo'
						/>
						<div className='mt-2 !font-josefin'>
							Blog
							<br />
							Admin
						</div>
					</Link>
				</div>
				<div className='flex flex-col justify-between h-full'>
					<div className='flex items-start flex-col mt-4'>
						{menu.map((item) => {
							return (
								<div key={item.path} className='group py-1 w-full pl-2'>
									<NavLink
										className={({ isActive }) => {
											return classNames(
												'pl-4 block pr-8 py-2.5 text-xl transition',
												'group-hover:bg-light-fading/80 dark:group-hover:bg-dark rounded',
												{
													'text-theme-light font-bold bg-light-fading/80 dark:bg-dark dark:text-theme-dark-light hover:text-theme-light-deep dark:hover:text-theme-dark':
														isActive,
													'text-dark-fading dark:text-light-fading hover:text-theme-light dark:hover:text-theme-dark':
														!isActive,
												}
											);
										}}
										to={item.path}
									>
										<item.icon className='w-6 h-6 mb-1 inline-block align-middle mr-2' />
										{item.text} <span className='text-xs'></span>
									</NavLink>
								</div>
							);
						})}
					</div>
					<div className='pl-2 m-2 cursor-pointer'>
						<div
							onClick={logout}
							className='p-2 flex items-center  text-gray-600 hover:text-black hover:bg-gray-100 rounded'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6 mr-2'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={2}
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
								/>
							</svg>
							<span>退出</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Menu;
