import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { postsService } from '@/api';
import useSWR from 'swr';
import ArticleContent from '@/components/Article/index';
import dayjs from 'dayjs';
import { AnimatePresence, motion } from 'framer-motion';
import {Icon} from "@iconify/react"
import Toolbar from '@/components/Toolbar';

const Article: React.FC = () => {
	const { key } = useParams();
	const { data: articleData, error } = useSWR(['/posts/get', key], (_, key) =>
		postsService.get(key || '')
	);
	if (error) {
		return <Navigate to='/' />;
	}
	return (
		<div className='pb-12 sm:mt-12 max-w-2xl mx-auto px-2'>
			<AnimatePresence>
				{!!articleData ? (
					<motion.div
						initial={{
							opacity: 0,
							translateX: 10,
						}}
						animate={{
							opacity: 1,
							translateX: 0,
						}}
						exit={{
							opacity: 0,
							translateX: 10,
						}}
					>
						<h1 className='text-4xl leading-snug  text-auto-color font-bold'>
							{articleData?.data?.title}
						</h1>
						<p className='text-xs text-gray-400 mt-4 mb-2'>
							{dayjs(articleData?.data?.create_time).format('YYYY-MM-DD')}
						</p>
						<ArticleContent>{articleData?.data?.content || ''}</ArticleContent>
					</motion.div>
				) : (
					<motion.div className='flex items-center min-h-[24rem] justify-center'>
            <Icon  icon={"eos-icons:loading"} className="text-lg"/>
					</motion.div>
				)}
			</AnimatePresence>
			{!!articleData && <Toolbar />}
		</div>
	);
};

export default Article;
