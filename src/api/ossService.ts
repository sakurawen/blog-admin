import { request } from '@/utils';
import { ServiceResponse, STSToken } from '@/@types';

/**
 * 获取sts
 * @returns
 */
export const getSTS = () => {
	return request.post<any, ServiceResponse<STSToken>>('/oss/getSTS');
};
