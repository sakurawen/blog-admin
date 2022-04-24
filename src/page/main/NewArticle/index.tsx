import React, { useRef, useState, useMemo } from 'react';
import MarkdownEditor, { EditorRef } from '@/components/MarkdownEditor';
import { useNavigate } from 'react-router-dom';
import {  nodeService, postsService } from '@/api';
import { useToast } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Modal, ModalBody, ModalFooter } from '@/components/Modal';
import Button from '@/components/Button';
import { useAppSelector } from '@/store';
import useSWR from 'swr';
import Select from '@/components/Select';
import { FormControl, FormLabel } from '@chakra-ui/react';

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
	const toast = useToast();
	const jumpKey = useRef('');
	const handleArticleSave = () => {
		const { title, content } = editData.current;
		if (content.trim().length === 0 || title.trim().length === 0) {
			toast({
				position: 'top',
				title: '发布失败',
				status: 'error',
				description: '文章内容和文章标题不能为空',
				isClosable: true,
				duration: 2000,
			});
			return;
		}
		postsService
			.save({ title, content, node_key: articleNode?.value || '' })
			.then((res) => {
				editor.current?.reset().then(() => {
					jumpKey.current = res.data.article_key;
					toast({
						position: 'top',
						title: '保存成功',
						status: 'success',
						duration: 2000,
					});
					setLoading(false);
					if (jumpKey.current.length !== 0) {
						navigate(`../post/${jumpKey.current}`);
					}
				});
			})
			.catch((err) => {
				console.error('发布文章失败:', err);
				toast({
					position: 'top',
					title: `保存失败:${err}`,
					status: 'error',
					duration: 2000,
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
			toast({
				position: 'top',
				title: '发布失败',
				status: 'error',
				description: '文章内容和文章标题不能为空',
				isClosable: true,
				duration: 2000,
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
					<FormControl isRequired>
						<FormLabel>发布节点</FormLabel>
						<Select
							placeholder='选择发布节点'
							options={nodeOptions ?? []}
							value={articleNode}
							onChange={(val) => setArticleNode(val)}
						/>
					</FormControl>
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
