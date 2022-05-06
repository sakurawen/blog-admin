import axios from 'axios';
import conf from '@/conf';

const HTTP_STATUS = {
	UN_AUTHORIZED: 401,
	OK: 200,
};

const instance = axios.create({
	baseURL: conf.test ? 'http://localhost:9527' : 'https://api.omazio.com/v1',
});

instance.interceptors.request.use((config) => {
	const token = localStorage.getItem('token') || '';
	if (config.headers) {
		config.headers['Authorization'] = token;
	}
	return config;
});

instance.interceptors.response.use((response) => {
	if (response.status === 200) {
		if (response.data.code === HTTP_STATUS.OK) {
			return Promise.resolve(response.data);
		}
		if (response.data.code === HTTP_STATUS.UN_AUTHORIZED) {
			console.log('unauthrized');
			if (!localStorage.getItem('token')) return Promise.reject('token过期');
			localStorage.removeItem('token');
			window.location.href = window.location.origin + '/login';
			return Promise.reject('token过期');
		}
		return Promise.reject(response.data.msg);
	}
	return Promise.reject(new Error('请求失败'));
});

export default instance;
