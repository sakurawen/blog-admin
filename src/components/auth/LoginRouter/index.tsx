import React from 'react';
import { Navigate } from 'react-router-dom';
import { useLoginAuth } from '@/hooks';

type LoginRouterProps = {
	children: JSX.Element;
};

const LoginRouter = (props: LoginRouterProps) => {
	const { children } = props;
	const isLogin = useLoginAuth();
	if (isLogin) {
		return children;
	}
	return <Navigate replace={true} to='/login' />;
};

export default LoginRouter;
