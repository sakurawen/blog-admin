import {
	Article,
	ArticleSaveResp,
	Page,
	Pageable,
	ServiceResponse,
} from '@/@types';
import { request } from '@/utils';
import { CancelToken } from 'axios';

type AddArticleForm = {
	title: string;
	content: string;
	node_key: string;
};

/**
 * 新增文章数据
 * @returns
 */
export const save = (form: AddArticleForm) => {
	return request.post<any, ServiceResponse<ArticleSaveResp>>(
		'/article/save',
		form
	);
};

/**
 * 获取文章详情
 * @param key 文章key
 * @returns
 */
export const get = (key: string) => {
	return request.get<any, ServiceResponse<Article>>(`/article/get?key=${key}`);
};

/**
 * 获取文章分页数据
 * @param pageable
 * @returns
 */
export const page = (pageable: Pageable, cancelToken: CancelToken) => {
	return request.post<any, ServiceResponse<Page<Article[]>>>(
		'/article/page',
		pageable,
		{
			cancelToken: cancelToken,
		}
	);
};

/**
 * 根据key删除文章
 * @param key
 * @returns
 */
export const del = (key: string) => {
	return request.post<any, ServiceResponse>('/article/del', {
		key,
	});
};

export const update = (form: {
	title: string;
	content: string;
	key: string;
	node_key: string;
}) => {
	return request.post<any, ServiceResponse<Article>>('/article/update', form);
};
