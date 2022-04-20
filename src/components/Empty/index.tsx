import React from 'react';

const Empty: React.FC = () => {
	return (
		<div>
			<div className='text-center mt-24 text-dark/20 dark:text-light-fading/20'>
				<span className='text-xs select-none'>empty</span>
			</div>
		</div>
	);
};

export default Empty;
