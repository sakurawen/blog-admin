import React from 'react';
import { useMatch, useNavigate } from 'react-router-dom';
import { ArrowSmLeftIcon } from '@heroicons/react/outline';

const Navbar: React.FC = () => {
	const matchPost = useMatch('/post/:id');
	const matchPosts = useMatch('/posts/:id');
	const matchEdit = useMatch('/edit/:id');
	const navigate = useNavigate();
	const handleGoBack = () => {
		navigate(-1);
	};
	return (
		(matchPost || matchEdit || matchPosts) && (
			<nav className='h-16 sticky border-r border-b top-0 z-50 bg-light dark:bg-dark-deep bg-blur  border-dark/5 dark:border-light/5'>
				<div className='flex h-full px-2 justify-between items-center'>
					<button onClick={handleGoBack}>
						<ArrowSmLeftIcon className='inline-block w-8 h-8' />
					</button>
				</div>
			</nav>
		)
	);
};

export default Navbar;
