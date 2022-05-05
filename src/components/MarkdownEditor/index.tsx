import React, {
	useState,
	useRef,
	useEffect,
	useImperativeHandle,
	forwardRef,
	KeyboardEvent,
	useMemo,
	memo,
	useCallback,
	startTransition,
} from 'react';
import {
	EyeIcon,
	PencilAltIcon,
	PhotographIcon,
	FilmIcon,
} from '@heroicons/react/outline';
import ArticleTemp from '@/components/Article';
import { oss } from '@/utils';
import cx from 'classnames';
import { withHistory } from 'slate-history';
import { withReact, Slate, Editable } from 'slate-react';
import { utils, renderLeaf, markdownDecorate } from './utils';
import dayjs from 'dayjs';
import { createEditor, Descendant, Transforms, Node,Editor } from 'slate';
import { useToast } from '@chakra-ui/react';
import { SaveIcon } from '@heroicons/react/outline';
import { Article } from '@/@types';
import { produce } from 'immer';
import { FormControl, FormLabel } from '@chakra-ui/react';
import Button from '@/components/Button';
import IconButton from '@/components/IconButton';
import Input from '@/components/Input';
import { Modal, ModalBody, ModalFooter } from '@/components/Modal';
import { renderElement } from './utils';

export type EditorRef = {
	reset: () => Promise<any>;
	content: string;
	title: string;
};

type EditorProps = {
	className?: string;
	// 是否启用本地缓存，启用时为新增模式，禁用时为编辑模式
	enableCache?: boolean;
	style?: React.CSSProperties;
	editArticle?: Article;
	onPost: (title: string, content: string) => void;
	loading?: boolean;
};

/**
 * 编辑器
 * @returns
 */
const MarkdownEditor = forwardRef((props: EditorProps, ref) => {
	const { className, onPost, style, enableCache, editArticle } = props;
	const toast = useToast();
	const [mode, setMode] = useState<'edit' | 'preview'>('edit');
	const [editData, setEditData] = useState(
		enableCache
			? {
					title: localStorage.getItem('cache_title') || '',
					content: localStorage.getItem('cache_content') || '',
			  }
			: {
					title: editArticle?.title || '',
					content: editArticle?.content || '',
			  }
	);
	const isEditMode = mode === 'edit';
	const isPreviewMode = mode === 'preview';
	const uploadInput = useRef<HTMLInputElement>(null);

	useImperativeHandle(ref, () => {
		return {
			title: editData.title,
			content: editData.content,
			reset: resetEditor,
		};
	});

	const autoSaveTimer = useRef<NodeJS.Timeout>();
	const [saveTime, setSaveTime] = useState<Date>();

	const editor = useMemo(() => withReact(withHistory(createEditor())), []);

	const [editModal, setEditModal] = useState<Descendant[]>(
		enableCache
			? utils.deserializeEditContent(
					localStorage.getItem('cache_content') || ''
			  ) || [
					{
						type: 'paragraph',
						children: [{ text: '' }],
					},
			  ]
			: utils.deserializeEditContent(editData.content)
	);

	/**
	 * 重置编辑器
	 */
	const resetEditor = () => {
		return new Promise<void>((resolve) => {
			console.log('resetEditor');
			localStorage.setItem('cache_content', '');
			localStorage.setItem('cache_title', '');
			const child = editor.children;
			const lastPart = child.slice(child.length - 1, child.length)[0];
			setEditData(
				produce(editData, (d) => {
					d.title = '';
					d.content = '';
				})
			);
			Transforms.delete(editor, {
				at: {
					anchor: {
						path: [0, 0],
						offset: 0,
					},
					focus: {
						path: [editor.children.length - 1, 0],
						offset: Node.string(lastPart).length,
					},
				},
			});
			resolve();
		});
	};

	/**
	 * 处理编辑器变化
	 * @param val
	 */
	const handleEditContentChange = (val: Descendant[]) => {
		setEditModal(val);
		startTransition(() => {
			const mdContent = utils.serializeEditContent(val);
			setEditData(
				produce(editData, (d) => {
					d.content = mdContent;
				})
			);
		});
	};
	/** 处理编辑器点击事件 */
	const handleEditKeydown = (e: KeyboardEvent) => {
		const { key, shiftKey, ctrlKey, altKey } = e;
		// 缩进 2空格
		if (key === 'Tab') {
			e.preventDefault();
			editor.insertText('  ');
			return;
		}
		/**
		 * ctrl+alt + 触发
		 */
		if (!shiftKey && ctrlKey && altKey) {
			switch (key) {
				case 'i':
				case 'I':
					e.preventDefault();
					insertImage();
					break;
			}
		}
		/**
		 * ctrl + 触发
		 */
		if (!shiftKey && !altKey && ctrlKey) {
			switch (key) {
				case 'b':
				case 'B':
					e.preventDefault();
					utils.nodeTextFormat(editor, 'b');
					break;
				case 'i':
				case 'I':
					e.preventDefault();
					utils.nodeTextFormat(editor, 'i');
					break;
				case 'd':
				case 'D':
					e.preventDefault();
					utils.nodeTextFormat(editor, 'd');
					break;
			}
		}
	};

	/**
	 * 注册预览/编辑文章快捷键
	 */
	useEffect(() => {
		const registerKeyboard = (e: globalThis.KeyboardEvent) => {
			const { ctrlKey, shiftKey, key, altKey } = e;
			const lowwerKey = key.toLocaleLowerCase();
			// 注册预览快捷键 ctrl+alt + 特定键触发
			if (!(ctrlKey && !shiftKey && altKey)) return;
			if (lowwerKey === 'e') {
				e.preventDefault();
				setMode((mode) => (mode === 'edit' ? 'preview' : 'edit'));
				return;
			}
		};
		document.addEventListener('keydown', registerKeyboard);
		return () => {
			document.removeEventListener('keydown', registerKeyboard);
		};
	}, [isEditMode]);

	/**
	 * 本地保存输入内容
	 */
	useEffect(() => {
		clearTimeout(autoSaveTimer.current as NodeJS.Timeout);
		autoSaveTimer.current = setTimeout(() => {
			setSaveTime(new Date());
			if (enableCache) {
				localStorage.setItem('cache_content', editData.content || '');
				localStorage.setItem('cache_title', editData.title || '');
			}
		}, 1000);
	}, [editData.content, editData.title, enableCache]);

	/**
	 * 预览文章
	 * @returns
	 */
	const previewArticle = () => {
		setMode((mode) => (mode === 'edit' ? 'preview' : 'edit'));
	};

	/**
	 * 上传文件
	 * @param files
	 * @returns
	 */
	const imageUpload = (files: FileList | null) => {
		if (!uploadInput.current) {
			return;
		}

		if (files?.length === 0 || !files) {
			console.log('文件不存在');
			return;
		}

		const file = files[0];
		if (file.size > 1024 * 1024 * 2) {
			toast({
				title: '错误',
				description: '请上传文件大小2M以内的图片',
				position: 'top',
				duration: 2000,
			});
			uploadInput.current.value = '';
			return;
		}

		const timestemp = new Date().getTime();
		const uploadFileName = '/image/' + timestemp + file.name;
		oss
			.getOssClient()
			.then((client) => {
				client
					.put(uploadFileName, file)
					.then((res: any) => {
						Transforms.insertText(editor, `![${res.name}](${res.url})\n`);
					})
					.finally(() => {
						if (uploadInput.current) {
							uploadInput.current.value = '';
						}
					});
			})
			.catch(() => {
				toast({
					title: '系统繁忙',
					status: 'error',
					position: 'top',
				});
			});
	};
	/**
	 * 插入图片
	 */
	const insertImage = () => {
		uploadInput.current?.click();
	};

	/**
	 * 发送文章
	 */
	const handleArticlePost = () => {
		onPost(editData.title, editData.content);
	};

	const handleChangeTitle = (title: string) => {
		setEditData(
			produce(editData, (d) => {
				d.title = title;
			})
		);
	};

	const [openMediaModal, setOpenMediaModal] = useState(false);
	const [mediaUrl, setMediaUrl] = useState('');

	const handleOpenMediaModal = () => {
		setOpenMediaModal(true);
	};
	const handleCloseMediaModal = () => {
		setOpenMediaModal(false);
		setMediaUrl('');
	};

	const handleInsertMedia = () => {
		try {
			const comp = utils.getMediaComponentStr(mediaUrl);
			Transforms.insertText(editor, comp || '');
			handleCloseMediaModal();
			toast({
				position: 'top',
				title: '插入媒体成功',
				duration: 1500,
			});
		} catch (err) {
			toast({
				position: 'top',
				title:(err as Error).message,
				duration: 1500,
			});
			console.log(err);
		}
	};

	const _renderLeaf = useCallback(renderLeaf, []);

	const _decorate = useCallback(markdownDecorate, []);

	const _renderElement = useCallback(renderElement, []);

	return (
		<div
			className={cx(['pb-1 flex flex-col ', className])}
			style={isEditMode ? style : {}}
		>
			{/* title and tools  */}
			<div className={cx('rounded mb-3 z-20 ')}>
				<div className='flex items-center border-b border-gray-100 dark:border-dark-fading pb-6 justify-between'>
					<div
						className={cx(
							'flex-1 transition relative  border-gray-300 border-opacity-30 pr-2 mr-2'
						)}
					>
						<div
							className={cx(
								'px-2.5 py-1 text-xs  rounded-md text-theme-light bg-theme-light/20 dark:text-theme-dark dark:bg-theme-dark/20',
								isPreviewMode ? 'inline-block' : 'hidden'
							)}
						>
							预览模式
						</div>
						<input
							maxLength={56}
							autoFocus
							disabled={isPreviewMode}
							value={editData.title}
							spellCheck={false}
							onChange={(e) => handleChangeTitle(e.target.value)}
							className={cx(
								'font-noto font-bold placeholder-dark/20 dark:placeholder-light/20 text-3xl h-full leading-snug   outline-none bg-transparent w-full  text-black dark:text-white',
								{
									hidden: isPreviewMode,
								}
							)}
							placeholder='Untitled'
							type='text'
						/>
					</div>
					{/* tool btn */}
					<div
						className={cx({
							hidden: isPreviewMode,
						})}
					>
						<IconButton tips='插入图片(ctrl+alt+i)' onClick={insertImage}>
							<PhotographIcon className='block w-4 h-4' />
							<input
								accept='image/gif,image/jpeg,image/png,image/jpg'
								onChange={(e) => imageUpload(e.target.files)}
								name='insertImage'
								type='file'
								ref={uploadInput}
								className='hidden'
							/>
						</IconButton>
						<IconButton onClick={handleOpenMediaModal} tips='插入媒体'>
							<FilmIcon className='block w-4 h-4' />
						</IconButton>
					</div>
					<IconButton
						tips={(isEditMode ? '预览' : '编辑') + ' (ctrl+alt+e)'}
						onClick={previewArticle}
					>
						{isEditMode ? (
							<EyeIcon className='block w-4 h-4' />
						) : (
							<PencilAltIcon className='block w-4 h-4' />
						)}
					</IconButton>
					<IconButton
						variants='primary'
						onClick={handleArticlePost}
						tips={enableCache ? '发布' : '保存'}
					>
						<SaveIcon className='w-4 h-4 block ' />
					</IconButton>
				</div>
			</div>
			{/* preview */}
			{isPreviewMode && (
				<div className='flex-1'>
					<div className='mb-4 mt-12 max-w-2xl mx-auto min-h-[24rem]'>
						<h1 className='text-4xl text-auto-color leading-snug font-bold'>
							{editData.title}
						</h1>
						<p className='text-xs text-gray-400 mt-4 mb-2'>
							{dayjs(editArticle?.create_time ?? new Date()).format(
								'YYYY-MM-DD'
							)}
						</p>
						<ArticleTemp>{editData.content}</ArticleTemp>
					</div>
				</div>
			)}
			{isEditMode && (
				<div
					style={{
						height: 'calc(100% - 6rem)',
					}}
					className='flex-1 pt-3 pb-8 h-full relative rounded  transition-colors '
				>
					<Slate
						editor={editor}
						onChange={(val) => handleEditContentChange(val)}
						value={editModal}
					>
						<Editable
							renderLeaf={_renderLeaf}
							decorate={_decorate}
							renderElement={_renderElement}
							aria-label='editor'
							className={cx(
								'leading-relaxed break-words font-noto text-lg text-dark  pb-32 w-full h-full overflow-y-scroll dark:text-gray-300'
							)}
							spellCheck={false}
							onKeyDown={handleEditKeydown}
							placeholder='输入正文，支持markdown语法'
						/>
					</Slate>
					{enableCache ? (
						<span className='absolute bottom-1 left-0 text-gray-400 dark:text-gray-500 text-xs select-none bg-light-fading dark:bg-dark-fading/60 px-2.5 py-1 rounded'>
							自动保存: {dayjs(saveTime).format('YYYY/MM/DD HH:mm:ss')}
						</span>
					) : (
						<span className='absolute bottom-1 left-0 text-theme-light bg-theme-light/20 dark:text-theme-dark dark:bg-theme-dark/20 text-xs select-none px-2.5 py-1 rounded'>
							编辑模式
						</span>
					)}
					<span className='absolute bottom-1 right-0 text-gray-400 dark:text-gray-500 text-xs select-none bg-light-fading dark:bg-dark-fading/60 px-2.5 py-1 rounded'>
						{editData.content.length}
					</span>
				</div>
			)}
			<Modal
				title='添加媒体'
				open={openMediaModal}
				onClose={handleCloseMediaModal}
				enableCloseButton
			>
				<ModalBody>
					<FormControl isRequired>
						<FormLabel>媒体链接</FormLabel>
						<Input value={mediaUrl} onChange={(val) => setMediaUrl(val)} />
					</FormControl>
				</ModalBody>
				<ModalFooter flex>
					<Button onClick={handleCloseMediaModal} variants='second'>
						取消
					</Button>
					<Button
						onClick={handleInsertMedia}
						disabled={mediaUrl.trim().length === 0}
					>
						插入
					</Button>
				</ModalFooter>
			</Modal>
		</div>
	);
});

export default memo(MarkdownEditor);
