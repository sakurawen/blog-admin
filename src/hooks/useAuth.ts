import { useAppSelector } from '@/store';

/**
 * 应用登录权限
 * @returns
 */
function useLoginAuth() {
	const userInfo = useAppSelector((state) => state.user.info);
	return !!userInfo;
}
export default useLoginAuth;
