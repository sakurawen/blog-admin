import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import NotFound from '@/assets/images/illustrations/404.svg';

const NotFoundImage = <img className='h-full' src={NotFound} alt='' />;

/**
 * 404提示页面
 * @returns
 */
const Result: React.FC = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const handleGoBack = () => {
		navigate(-1);
	};
	return (
		<div className='flex px-2 items-center justify-between'>
			<div className='mx-auto my-24 text-center'>
				<div className='my-16 h-60'>{NotFoundImage}</div>
				<p className='text-sm mb-8'>
					这里或许曾经是个页面，
					<br />
					但现在不是了…
				</p>
				<button
					onClick={handleGoBack}
					className='w-36 py-2 transition-colors bg-theme-light hover:bg-theme-light-deep dark:bg-theme-dark dark:hover:bg-theme-dark-deep rounded shadow text-white '
				>
					{t('result.goBack')}
				</button>
			</div>
		</div>
	);
};

export default Result;
