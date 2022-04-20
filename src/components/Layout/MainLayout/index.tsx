import React from 'react';
import { Outlet } from 'react-router-dom';
import Menu from '@/components/Menu';
import Navbar from '@/components/Navbar';
import BottomNav from '@/components/BottomNav';

const AdminLayout: React.FC = () => {
	return (
		<div className='sm:flex min-h-screen m-auto'>
			<Menu />
			<div className='sm:min-h-full  flex-1 sm:main'>
				<Navbar />
				<div className='pt-6 overflow-x-hidden sm:pb-0 pb-20 px-2 sm:px-4'>
					<Outlet />
				</div>
			</div>
			<BottomNav />
		</div>
	);
};

export default AdminLayout;
