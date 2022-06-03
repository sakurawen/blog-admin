import React, { useEffect, useRef, useState } from 'react';
import { Article, Node, Pageable } from '@/@types';
import { postsService as articleService, nodeService } from '@/api';

import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { Modal, ModalBody, ModalFooter } from '@/components/Modal';
import { AnimatePresence, motion } from 'framer-motion';
import Button from '@/components/Button';
import Row from '@/components/Row';
import { useParams } from 'react-router-dom';
import { produce } from 'immer';
import Pagination from '@/components/Pagination';
import Search from '@/components/Search';
import Empty from '@/components/Empty';
import axios from 'axios';
import { useAppSelector } from '@/store';
import IconButton from '@/components/IconButton';
import NewArticle from '@/page/main/NewArticle';
import EditArticle from '../EditArticle';
import PreviewPosts from './post';

type PostsListProsp = {
	searchNodeKey?: boolean;
};
/**
 * Post list page
 * @returns
 */
const PostsList: React.FC<PostsListProsp> = (props) => {
	const account = useAppSelector((state) => state.user.info?.account) || '';
	const navigate = useNavigate();
	const cancel = useRef(axios.CancelToken.source());
	const { searchNodeKey } = props;
	const { node_key } = useParams();
	const [pageable, setPageable] = useState<Pageable>({
		conditions: {
			title: '',
		},
		rules: {
			title: 'like',
		},
		page: {
			size: 10,
			number: 1,
			order_by: 'create_time desc',
		},
	});

	const [node, setNode] = useState<Node>();

	const [articlePage, setArticlePage] = useState({
		total: 0,
		count: 0,
		rows: [] as Article[],
	});

	useEffect(() => {
		if (!searchNodeKey) return;
		nodeService.get(node_key || '').then((res) => {
			setNode(res.data);
		});
		setPageable((p) => {
			p.conditions.node_key = node_key;
			return { ...p };
		});
		return () => {
			setNode(undefined);
			setPageable((p) => {
				p.conditions = {};
				return { ...p };
			});
		};
	}, [node_key, searchNodeKey]);

	useEffect(() => {
		cancelRequest();
		articleService
			.page(account, pageable, cancel.current.token)
			.then((res) => {
				setArticlePage(res.data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [pageable, account]);

	const getArticlePage = () => {
		cancelRequest();
		articleService.page(account, pageable, cancel.current.token).then((res) => {
			setArticlePage(res.data);
		});
	};
	const cancelRequest = () => {
		cancel.current.cancel('请求取消');
		cancel.current = axios.CancelToken.source();
	};

	const handlePreviewPosts = (e: React.MouseEvent, key: string) => {
		e.stopPropagation();
		setPreviewPostsKey(key);
		setOpenPreview(true);
	};

	const [editPostsKey, setEditPostsKey] = useState('');
	const handleEditPosts = (key: string) => {
		setEditPostsKey(key);
		setOpenEdit(true);
	};

	const [delOpen, setDelOpen] = useState(false);
	const [delArticle, setDelArticle] = useState<Article>();
	const [delLoading, setDelLoading] = useState(false);

	const handleCloseDelModal = () => {
		setDelOpen(false);
		setDelArticle(undefined);
	};
	const handleConfirmDel = () => {
		setDelLoading(true);
		articleService
			.del(delArticle?.article_key || '')
			.then((res) => {
				console.log('res:', res);
				handleCloseDelModal();
				if (articlePage.count <= 1 && pageable.page.number !== 1) {
					setPageable(
						produce(pageable, (d) => {
							d.page.number--;
						})
					);
					return;
				} else {
					getArticlePage();
				}
			})
			.catch((err) => {
				console.error('删除文章失败: ', err);
			})
			.finally(() => {
				setDelLoading(false);
			});
	};

	const handleDelArticle = (e: React.MouseEvent, article: Article) => {
		e.stopPropagation();
		setDelArticle(article);
		setDelOpen(true);
	};

	const prevPage = () => {
		if (pageable.page.number === 1) return;
		setPageable(
			produce(pageable, (d) => {
				d.page.number--;
			})
		);
	};
	const nextPage = () => {
		if (!articlePage) return;
		if (
			pageable.page.number >= Math.ceil(articlePage.total / pageable.page.size)
		) {
			return;
		}
		setPageable(
			produce(pageable, (d) => {
				d.page.number++;
			})
		);
	};

	/**
	 * 搜索逻辑，输入结束后500ms开始搜索
	 */
	const searchTimer = useRef<NodeJS.Timeout>();
	const [searchVal, setSearchVal] = useState('');
	const handleSearchValChange = (val: string) => {
		setSearchVal(val);
		if (searchTimer.current) {
			clearTimeout(searchTimer.current);
		}
		searchTimer.current = setTimeout(() => {
			setPageable(
				produce(pageable, (d) => {
					d.page.number = 1;
					d.conditions.title = val.trim();
				})
			);
		}, 500);
	};

	// 控制新增模态框
	const [openAdd, setOpenAdd] = useState(false);

	// 控制编辑模态框
	const [openEdit, setOpenEdit] = useState(false);

	// 控制预览模态框
	const [openPreview, setOpenPreview] = useState(false);

	const handleCloseEditPostsModal = () => {
		setOpenEdit(false);
		setEditPostsKey('');
	};

	const [previewPostsKey, setPreviewPostsKey] = useState('');
	const handleClosePreviewPostsModal = () => {
		setOpenPreview(false);
		setPreviewPostsKey('');
	};

	return (
		<AnimatePresence>
			{articlePage ? (
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
					<h1 className='mb-6 text-2xl flex justify-between  font-bold text-auto-color'>
						<span>
							Posts
							<span className='text-sm font-normal'>
								{' '}
								/ {searchNodeKey ? node?.name : 'all'}
							</span>
						</span>
						<IconButton
							variants='primary'
							tips='新增节点'
							onClick={() => setOpenAdd(true)}
						>
							<PlusIcon className='block w-4 h-4' />
						</IconButton>
					</h1>
					<Search value={searchVal} onChange={handleSearchValChange} />
					<div>
						{articlePage.rows.length ? (
							articlePage.rows?.map((item) => {
								return (
									<Row
										onClick={() => {
											handleEditPosts(item.article_key);
										}}
										key={item.id}
										className='flex group items-center justify-between'
									>
										<p className='text-sm flex-1 overflow-ellipsis overflow-hidden  text-auto-color'>
											<span className='whitespace-nowrap pointer-events-none'>
												{item.title}
											</span>
										</p>
										<div className='space-x-1'>
											<button
												onClick={(e) => handlePreviewPosts(e, item.article_key)}
												className='py-0.5 px-2  transition-colors text-sm rounded text-gray-300 dark:text-dark-fading group-hover:text-gray-600 dark:group-hover:text-slate-200  hover:!text-theme-light dark:hover:!text-theme-dark'
											>
												查看
											</button>
											<button
												onClick={(e) => {
													handleDelArticle(e, item);
												}}
												className='py-0.5 px-1 transition-colors text-sm mr-2 rounded text-gray-300 dark:text-dark-fading  group-hover:text-gray-600 dark:group-hover:text-slate-200 dark:hover:!text-red-600 hover:!text-rose-500'
											>
												<TrashIcon className='inline-block h-full w-4 align-middle mb-1 ' />
											</button>
										</div>
									</Row>
								);
							})
						) : (
							<Empty />
						)}
						<Pagination
							total={articlePage.total}
							size={pageable.page.size}
							number={pageable.page.number}
							onNext={nextPage}
							onPrev={prevPage}
						/>
					</div>
					<Modal
						loading={delLoading}
						title={`确定删除文章《${delArticle?.title}》？`}
						open={delOpen}
						onClose={handleCloseDelModal}
					>
						<ModalBody>
							<p className='my-4'>删除后不可恢复，请谨慎操作</p>
						</ModalBody>
						<ModalFooter>
							<div className='flex gap-2 items-center'>
								<Button
									variants='second'
									disabled={delLoading}
									onClick={handleCloseDelModal}
								>
									取 消
								</Button>
								<Button
									loading={delLoading}
									onClick={handleConfirmDel}
									variants='primary'
								>
									确 定
								</Button>
							</div>
						</ModalFooter>
					</Modal>
					{/* 新增文章 */}
					<Modal
						loading={false}
						enableCloseButton
						open={openAdd}
						onClose={() => setOpenAdd(false)}
						title='新增文章'
						className='w-[98%] h-[96%] overflow-hidden pb-4'
					>
						<ModalBody className='h-[94%]'>
							<NewArticle />
						</ModalBody>
					</Modal>
					{/* 编辑文章 */}
					<Modal
						loading={false}
						open={openEdit}
						title='编辑文章'
						enableCloseButton
						onClose={handleCloseEditPostsModal}
						className='w-[98%] h-[96%] overflow-hidden pb-4'
					>
						<ModalBody className='h-[94%]'>
							<EditArticle postsKey={editPostsKey} />
						</ModalBody>
					</Modal>
					{/* 查看文章 */}
					<Modal
						title='文章预览'
            className='w-[64rem] h-[96%] overflow-hidden pb-4'
						open={openPreview}
						enableCloseButton
						onClose={handleClosePreviewPostsModal}
					>
						<ModalBody className='h-[94%]'>
							<PreviewPosts postsKey={previewPostsKey} />
						</ModalBody>
					</Modal>
				</motion.div>
			) : (
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
					className='flex items-center justify-center mt-24'
				>
					loading...
				</motion.div>
			)}
		</AnimatePresence>
	);
};

export default PostsList;
