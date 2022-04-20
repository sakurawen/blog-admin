import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
type PaginationProps = {
	onNext: () => void;
	onPrev: () => void;
	number: number; //当前页数
	total: number; //数据总数
	size: number; //分页大小
};

/**
 * 分页
 * @param props
 * @returns
 */
const Pagination: React.FC<PaginationProps> = (props) => {
	const { size, total, number, onNext, onPrev } = props;
	const currentPageNumber = number;
	const endPageNumber = Math.ceil(total / size);
	if (endPageNumber <= 1) {
		return null;
	}
	return (
		<div className='flex justify-center items-center select-none mt-8'>
			<ChevronLeftIcon
				onClick={onPrev}
				className='w-5 h-5 inline-block hover:bg-light-deep rounded dark:hover:bg-dark-fading cursor-pointer'
			/>
			<div className='text-sm mx-2 pb-0.5'>
				{currentPageNumber} / {endPageNumber}
			</div>
			<ChevronRightIcon
				onClick={onNext}
				className='w-5 h-5 inline-block hover:bg-light-deep rounded dark:hover:bg-dark-fading cursor-pointer'
			/>
		</div>
	);
};

export default Pagination;
