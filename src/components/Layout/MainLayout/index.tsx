import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';

const AdminLayout: React.FC = () => {
	return (
		<div className='sm:flex min-h-screen m-auto'>
			<Menu />
			<div className='sm:min-h-full flex-1 sm:main'>
				<Navbar />
				<div className='pt-6  sm:pb-0 pb-20 overflow-x-hidden px-2 sm:px-4'>
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminLayout;
