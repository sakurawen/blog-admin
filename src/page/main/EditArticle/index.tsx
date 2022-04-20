import React, { useEffect, useState, useMemo } from 'react';
import MarkdownEditor from '@/components/MarkdownEditor';
import { useParams } from 'react-router-dom';
import { articleService, nodeService } from '@/api';
import { Article } from '@/@types';
import { AnimatePresence, motion } from 'framer-motion';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter } from '@/components/Modal';
import Select from '@/components/Select';
import Button from '@/components/Button';
import { FormControl, FormLabel } from '@chakra-ui/react';
import useSWR from 'swr';
import { useAppSelector } from '@/store';

/**
 * 文章编辑
 * @returns
 */
const EditArticle: React.FC = () => {
	const navigate = useNavigate();
	const userInfo = useAppSelector((state) => state.user.info);
	const { key } = useParams();
	const [editArticle, setEditArticle] = useState<Article>();
	const [init, setInit] = useState(false);
	useEffect(() => {
		articleService
			.get(key || '')
			.then((res) => {
				setEditArticle(res.data);
			})
			.finally(() => {
				setInit(true);
			});
	}, [key]);

	const [loading, setLoading] = useState(false);
	const toast = useToast();

	const { data: nodes } = useSWR(['/node/all', userInfo?.account], (_, account) => nodeService.all(account || ''));
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
	const [articleNode, setArticleNode] = useState<{ text: string; value: any }>();

	const [openSelectNodeModal, setOpenSelectNodeModal] = useState(false);

	/**
	 * 获取之前选择的文章节点
	 * @returns
	 */
	const getLegacySelectNode = () => {
		const node = nodeOptions?.find((item) => item.value === editArticle?.node_key);
		if (node) {
			return node;
		}
		return undefined;
	};

	const [articleForm, setArticleForm] = useState({
		title: '',
		content: '',
	});

	const handleShowSelectNodeModal = (title: string, content: string) => {
		const legacyNode = getLegacySelectNode();
		setArticleNode(legacyNode);
		setOpenSelectNodeModal(true);
		setArticleForm({
			title,
			content,
		});
	};

	const handleCloseSelectNodeModal = () => {
		setArticleForm({
			title: '',
			content: '',
		});
		setOpenSelectNodeModal(false);
		setArticleNode(undefined);
	};

	/**
	 * 提交
	 */
	const handlePost = () => {
		if (loading) return;
		setLoading(true);
		articleService
			.update({
				title: articleForm.title,
				content: articleForm.content,
				key: key || '',
				node_key: articleNode?.value,
			})
			.then((res) => {
				toast({
					position: 'top',
					title: '保存成功',
					status: 'success',
					duration: 1500,
				});
				navigate(`../post/${res.data.article_key}`);
			})
			.catch((err) => {
				toast({
					position: 'top',
					title: '保存失败',
					status: 'error',
					duration: 1500,
				});
			})
			.finally(() => {
				setLoading(false);
			});
	};

	return (
		<div>
			<AnimatePresence>
				{init && (
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
						<MarkdownEditor
							className='h-edit-editor'
							editArticle={editArticle}
							onPost={handleShowSelectNodeModal}
							enableCache={false}
						/>
					</motion.div>
				)}
			</AnimatePresence>
			<Modal
				loading={loading}
				title='保存文章'
				enableCloseButton
				open={openSelectNodeModal}
				onClose={handleCloseSelectNodeModal}
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
					<Button disabled={loading} variants='second' onClick={handleCloseSelectNodeModal}>
						取消
					</Button>
					<Button loading={loading} onClick={handlePost} disabled={articleNode === undefined}>
						确定
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
};

export default EditArticle;
