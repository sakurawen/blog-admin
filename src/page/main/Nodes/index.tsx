import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';
import { FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { Modal, ModalBody, ModalFooter } from '@/components/Modal';
import Input from '@/components/Input';
import { nodeService } from '@/api';
import { Node, Pageable } from '@/@types';
import { useNavigate } from 'react-router-dom';
import Row from '@/components/Row';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Pagination from '@/components/Pagination';
import Search from '@/components/Search';
import Empty from '@/components/Empty';
import { produce } from 'immer';
import { useAppSelector } from '@/store';

/**
 * 节点页面
 * @returns
 */
const Nodes: React.FC = () => {
	const navigate = useNavigate();
	const account = useAppSelector((state) => state.user.info?.account) || '';
	const toast = useToast();
	const [openSaveNodeModal, setOpenSaveNodeModal] = useState(false);
	const [openUpdateNodeModal, setOpenUpdateNodeModal] = useState(false);

	const [nodePage, setNodePage] = useState({
		total: 0,
		count: 0,
		rows: [] as Node[],
	});

	const [pageable, setPageable] = useState<Pageable>({
		page: {
			order_by: 'id',
			number: 1,
			size: 10,
		},
		conditions: {
			name: '',
		},
		rules: {
			name: 'like',
		},
	});

	useEffect(() => {
		nodeService.page(account, pageable).then((res) => {
			setNodePage(res.data);
		});
	}, [pageable]);

	const getNodePage = () => {
		nodeService.page(account, pageable).then((res) => {
			setNodePage(res.data);
		});
	};

	const [nodeName, setNodeName] = useState('');

	const [loading, setLoading] = useState(false);

	/** 关闭新增节点模态框 */
	const handleCloseAddNodeModal = () => {
		setOpenSaveNodeModal(false);
		setNodeName('');
	};

	/** 打开新增节点模态框 */
	const handleOpenAddNodeModal = () => {
		setOpenSaveNodeModal(true);
	};

	/** 编辑节点信息 */
	const [updateNode, setUpdateNode] = useState<Node>();
	const setUpdateNodeName = (val: string) => {
		if (updateNode === undefined) return;
		setUpdateNode(
			produce(updateNode, (d) => {
				d.name = val;
			})
		);
	};

	const handleOpenUpdateNodeModal = (e: React.MouseEvent, node: Node) => {
		e.stopPropagation();
		setUpdateNode(node);
		setOpenUpdateNodeModal(true);
	};

	const handleCloseUpdateNodeModal = () => {
		setUpdateNode(undefined);
		setOpenUpdateNodeModal(false);
	};

	const handleUpdateNode = () => {
		setLoading(true);
		nodeService
			.update({
				node_key: updateNode?.node_key || '',
				name: updateNode?.name || '',
			})
			.then(() => {
				toast({
					position: 'top',
					status: 'success',
					duration: 1000,
					title: '更新节点成功',
				});
				setOpenUpdateNodeModal(false);
				setUpdateNode(undefined);
				getNodePage();
			})
			.catch((err) => {
				toast({
					position: 'top',
					status: 'error',
					duration: 1000,
					title: err,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	};

	/** 新增节点 */
	const handleSaveNode = () => {
		if (nodeName.trim().length === 0) return;
		setLoading(true);
		nodeService
			.save({
				name: nodeName,
			})
			.then(() => {
				setNodeName('');
				setOpenSaveNodeModal(false);
				toast({
					title: '新增节点成功',
					duration: 1500,
					position: 'top',
					status: 'success',
				});
				getNodePage();
			})
			.catch((err) => {
				console.log('err:', err);
				toast({
					title: err,
					duration: 1500,
					position: 'top',
					status: 'error',
				});
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const [shwoDelModal, setShowDelModal] = useState(false);
	const [delNodeLoading, setDelNodeLoading] = useState(false);
	const delNode = useRef<Node>();

	/** 显示删除节点模态框 */
	const handleShowDelNodeModal = (e: React.MouseEvent, node: Node) => {
		e.stopPropagation();
		setShowDelModal(true);
		delNode.current = node;
	};

	/** 关闭删除节点模态框 */
	const handleCloseDelNodeModal = () => {
		setShowDelModal(false);
		delNode.current = undefined;
	};

	/** 删除节点 */
	const handleDeleteNode = () => {
		if (delNode.current === undefined) return;
		setDelNodeLoading(true);
		nodeService
			.del(delNode.current.node_key)
			.then((res) => {
				handleCloseDelNodeModal();
				toast({
					title: '删除节点成功',
					position: 'top',
					status: 'success',
					duration: 1000,
				});
				if (nodePage.count <= 1) {
					setPageable(
						produce(pageable, (d) => {
							d.page.number--;
						})
					);
					return;
				}
				getNodePage();
			})
			.catch((err) => {
				console.log('del node error:', err);
				toast({
					title: err,
					position: 'top',
					status: 'error',
					duration: 1500,
				});
			})
			.finally(() => {
				setDelNodeLoading(false);
			});
	};

	/** 跳转文章列表 */
	const handleNavToPosts = (key: string) => {
		navigate(`../posts/${key}`);
	};

	const handlePageNext = () => {
		setPageable(
			produce(pageable, (d) => {
				d.page.number++;
			})
		);
	};
	const handlePagePrev = () => {
		setPageable(
			produce(pageable, (d) => {
				d.page.number--;
			})
		);
	};

	/**
	 * 搜索相关
	 */
	const searchTimer = useRef<NodeJS.Timeout>();
	const [searchKey, setSearchKey] = useState('');
	const handleSearchKeyChange = (val: string) => {
		setSearchKey(val);
		if (searchTimer.current) {
			clearTimeout(searchTimer.current);
		}
		searchTimer.current = setTimeout(() => {
			setPageable(
				produce(pageable, (d) => {
					d.conditions.name = val.trim();
				})
			);
		}, 500);
	};

	return (
		<motion.div
			initial={{
				opacity: 0,
				translateX: 10,
			}}
			animate={{
				opacity: 1,
				translateX: 0,
			}}
		>
			<div className='flex mb-6 items-end justify-between'>
				<h1 className='text-2xl font-bold'>
					{/* <CubeTransparentIcon className='w-6 h-6 inline-block mr-2 align-bottom' /> */}
					<span>Nodes</span>
				</h1>
				<IconButton
					variants='primary'
					tips='新增节点'
					onClick={handleOpenAddNodeModal}
				>
					<PlusIcon className='block w-4 h-4' />
				</IconButton>
			</div>
			<Search value={searchKey} onChange={handleSearchKeyChange} />
			<div>
				{nodePage.rows.length ? (
					nodePage.rows.map((item) => {
						return (
							<Row
								ariaLabel='节点记录'
								onClick={() => handleNavToPosts(item.node_key)}
								className='transition flex items-center group justify-between'
								key={item.id}
							>
								<div style={{}} className='text-sm'>
									<span>{item.name}</span>
								</div>
								<div>
									<button
										onClick={(e) => handleOpenUpdateNodeModal(e, item)}
										className='py-0.5 mr-2 px-2  text-sm rounded text-gray-300 dark:text-dark-fading group-hover:text-gray-600 dark:group-hover:text-slate-200  hover:!text-theme-light dark:hover:!text-theme-dark'
									>
										编辑
									</button>
									<button onClick={(e) => handleShowDelNodeModal(e, item)}>
										<TrashIcon className='inline mb-1 w-4 h-4 text-gray-300 dark:text-dark-fading  group-hover:text-gray-600 dark:group-hover:text-slate-200 dark:hover:!text-red-600 hover:!text-rose-500' />
									</button>
								</div>
							</Row>
						);
					})
				) : (
					<Empty />
				)}
				<Pagination
					size={pageable.page.size}
					total={nodePage.total}
					number={pageable.page.number}
					onNext={handlePageNext}
					onPrev={handlePagePrev}
				/>
			</div>

			{/* del node modal */}
			<Modal
				loading={delNodeLoading}
				enableCloseButton
				open={shwoDelModal}
				onClose={handleCloseDelNodeModal}
				title='删除节点'
			>
				<ModalBody>
					<p>
						确定要删除节点
						<span className='inline-block mx-1 px-0.5 rounded-sm shadow-sm dark:bg-dark-fading text-theme-light dark:text-theme-dark shadow-black/5 bg-gray-100'>
							{delNode.current?.name}
						</span>
						?
					</p>
				</ModalBody>
				<ModalFooter flex className='gap-2'>
					<Button
						disabled={delNodeLoading}
						onClick={handleCloseDelNodeModal}
						variants='second'
					>
						取消
					</Button>
					<Button loading={delNodeLoading} onClick={handleDeleteNode}>
						确定
					</Button>
				</ModalFooter>
			</Modal>

			{/* add node modal */}
			<Modal
				loading={loading}
				title={'新增节点'}
				enableCloseButton
				open={openSaveNodeModal}
				onClose={handleCloseAddNodeModal}
			>
				<ModalBody>
					<FormControl isRequired>
						<FormLabel>节点名称</FormLabel>
						<Input
							value={nodeName}
							onChange={(val) => setNodeName(val)}
							type='text'
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button
						disabled={nodeName.trim().length === 0}
						onClick={handleSaveNode}
					>
						保 存
					</Button>
				</ModalFooter>
			</Modal>

			{/* add node modal */}
			<Modal
				loading={loading}
				title={'编辑节点'}
				enableCloseButton
				open={openUpdateNodeModal}
				onClose={handleCloseUpdateNodeModal}
			>
				<ModalBody>
					<FormControl isRequired>
						<FormLabel>节点名称</FormLabel>
						<Input
							value={updateNode?.name}
							onChange={(val) => setUpdateNodeName(val)}
							type='text'
						/>
					</FormControl>
				</ModalBody>
				<ModalFooter>
					<Button
						disabled={updateNode?.name.length === 0}
						onClick={handleUpdateNode}
					>
						保 存
					</Button>
				</ModalFooter>
			</Modal>
		</motion.div>
	);
};

export default Nodes;
