import React, { useRef, useState, useMemo } from 'react';
import MarkdownEditor, { EditorRef } from '@/components/MarkdownEditor';
import { useNavigate } from 'react-router-dom';
import { nodeService, postsService } from '@/api';
import { motion } from 'framer-motion';
import { Modal, ModalBody, ModalFooter } from '@/components/Modal';
import Button from '@/components/Button';
import { useAppSelector } from '@/store';
import useSWR from 'swr';
import Select from '@/components/Select';
import { showNotification } from '@mantine/notifications';
import Error from '@/components/Icon/Error';
import Success from '@/components/Icon/Success';

/**
 * 编辑页面
 * @returns
 */
const NewArticle: React.FC = () => {
	const [loading, setLoading] = useState(false);
	const userInfo = useAppSelector((state) => state.user.info);
	const { data: nodes } = useSWR(
		['/node/all', userInfo?.account],
		(_, account) => nodeService.all(account || '')
	);
	const nodeOptions = useMemo(
		() =>
			nodes?.data.map((item) => {
				return {
					value: item.node_key,
					text: item.name,
				};
			}),
		[nodes?.data]
	);
	const [articleNode, setArticleNode] = useState<{
		text: string;
		value: any;
	}>();

	const navigate = useNavigate();
	const jumpKey = useRef('');
	const handleArticleSave = () => {
		const { title, content } = editData.current;
		if (content.trim().length === 0 || title.trim().length === 0) {
			showNotification({
				title: '发布失败',
				message: '文章内容和文章标题不能为空',
				color: 'red',
				icon: <Error />,
			});
			return;
		}
		postsService
			.save({ title, content, node_key: articleNode?.value || '' })
			.then((res) => {
				editor.current?.reset().then(() => {
					jumpKey.current = res.data.article_key;
					showNotification({
						message: '保存成功',
						color: 'green',
						icon: <Success />,
					});
					setLoading(false);
					if (jumpKey.current.length !== 0) {
						navigate(`../post/${jumpKey.current}`);
					}
				});
			})
			.catch((err) => {
				console.error('发布文章失败:', err);
				showNotification({
					message: `保存失败:${err}`,
					color: 'red',
					icon: <Error />,
				});
				setLoading(false);
			});
	};

	const editor = useRef<EditorRef>();
	const [openAddModal, setOpenAddModal] = useState(false);
	const editData = useRef({
		title: '',
		content: '',
	});
	const handleCloseAddMocal = () => {
		setOpenAddModal(false);
		setArticleNode(undefined);
		editData.current.title = '';
		editData.current.content = '';
	};

	const handleOpenAddModal = (title: string, content: string) => {
		editData.current.title = title;
		editData.current.content = content;
		if (
			editData.current.title.trim().length === 0 ||
			editData.current.content.trim().length === 0
		) {
			showNotification({
				title: '发布失败',
				color: 'red',
				message: '文章内容和文章标题不能为空',
				icon: <Error />,
			});
			return;
		}
		setOpenAddModal(true);
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
			<div>
				<MarkdownEditor
					className='h-editor'
					ref={editor}
					enableCache={true}
					onPost={handleOpenAddModal}
				/>
			</div>
			{/* add article modal */}
			<Modal
				loading={loading}
				title='发布文章'
				enableCloseButton
				open={openAddModal}
				onClose={handleCloseAddMocal}
			>
				<ModalBody>
					<h1>发布节点</h1>
					<Select
						placeholder='选择发布节点'
						options={nodeOptions ?? []}
						value={articleNode}
						onChange={(val) => setArticleNode(val)}
					/>
				</ModalBody>
				<ModalFooter flex>
					<Button
						disabled={loading}
						variants='second'
						onClick={handleCloseAddMocal}
					>
						取消
					</Button>
					<Button
						loading={loading}
						onClick={handleArticleSave}
						disabled={articleNode === undefined}
					>
						确定
					</Button>
				</ModalFooter>
			</Modal>
		</motion.div>
	);
};

export default NewArticle;
