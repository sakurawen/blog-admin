import { Node, Page, Pageable, ServiceResponse } from '@/@types';
import  {request}  from '@/utils/';

/**
 * 保存节点
 * @param form
 * @returns
 */
export const save = (form: { name: string }) => {
	return request.post<any, ServiceResponse<Node>>('/node/save', form);
};

/**
 * 根据用户account获取所有节点
 * @param account
 * @returns
 */
export const all = (account: string) => {
	return request.post<any, ServiceResponse<Node[]>>(`/node/all/${account}`);
};


export const page = (account:string,pageable:Pageable)=>{
  return request.post<any,ServiceResponse<Page<Node[]>>>(`/node/page/${account}`,pageable)
}

/**
 * 根据node_key获取节点信息
 * @param key 
 * @returns 
 */
export const get = (key: string) => {
	return request.get<any, ServiceResponse<Node>>(`/node/get?node_key=${key}`);
};

/**
 * 根据节点id删除节点（禁用）
 * @param id
 * @returns
 */
export const del = (nodeKey: string) => {
	return request.post('/node/del', {
		node_key: nodeKey,
	});
};

/**
 * 更新节点
 * @param updateForm
 * @returns
 */
export const update = (updateForm: { node_key: string; name: string }) => {
	return request.post<any, ServiceResponse<Node>>('/node/update', updateForm);
};
