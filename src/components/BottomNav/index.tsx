import React from 'react';
import { menu } from '@/components/Menu';
import { NavLink, useMatch } from 'react-router-dom';
import cx from 'classnames';

/**
 * 底部导航
 * @returns
 */
const BottomNav: React.FC = () => {
	const m1 = useMatch(menu[0].path);
	const m2 = useMatch(menu[1].path);
	const m3 = useMatch(menu[2].path);
	const m4 = useMatch(menu[3].path);
	return (
		(m1 || m2 || m3 || m4) && (
			<div className='sm:hidden fixed z-30 bottom-0 left-0 w-full bg-white dark:bg-dark'>
				<div className='w-full flex border-t border-dark/5 dark:border-white/5 justify-between'>
					{menu.map((item) => {
						return (
							<div key={item.path} className='flex-1'>
								<NavLink
									className={({ isActive }) => {
										return cx({
											'text-theme-light dark:text-theme-dark-light hover:text-theme-light-deep dark:hover:text-theme-dark':
												isActive,
											'text-dark-fading dark:text-light-fading hover:text-theme-light dark:hover:text-theme-dark':
												!isActive,
										});
									}}
									to={item.path}
								>
									<div className='flex flex-col py-2 items-center select-none'>
										<item.icon className='w-5 h-5' />
										<span className='text-sm'>{item.text}</span>
									</div>
								</NavLink>
							</div>
						);
					})}
				</div>
			</div>
		)
	);
};

export default BottomNav;
