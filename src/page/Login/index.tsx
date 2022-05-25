import React, { useState } from 'react';
import { userService } from '@/api';
import { useDispatch } from 'react-redux';
import { userActions } from '@/store/reducer/userSlice';
import { useAppSelector } from '@/store';
import { Navigate } from 'react-router-dom';
import { showNotification } from '@mantine/notifications';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { produce } from 'immer';
import { motion } from 'framer-motion';
import cx from 'classnames';
import Error from '@/components/Icon/Error';
import Success from '@/components/Icon/Success';

/**
 * 登录页面
 * @returns
 */
const Login: React.FC = () => {
	const dispatch = useDispatch();
	const userInfo = useAppSelector((state) => state.user.info);
	const [loading, setLoading] = useState(false);
	const [loginForm, setLoginForm] = useState({
		account: '',
		pwd: '',
	});

	/**
	 * 提交表单
	 */
	const handleSubmit = () => {
		if (
			loginForm.account.trim().length === 0 ||
			loginForm.pwd.trim().length === 0
		) {
			showNotification({
				title: '登录失败',
				message: '请输入账号和密码',
				color: 'red',
        icon:<Error/>
			});
			return;
		}
		setLoading(true);
		userService
			.Login(loginForm)
			.then((res) => {
				dispatch(userActions.setTokenAndInfo(res.data));
				showNotification({
					title: '登录成功',
					message: '',
          color:"green",
          icon:<Success/>
				});
			})
			.catch((err: string) => {
				showNotification({
					title: '登录失败',
          color:"red",
					message: '请检查账号密码',
          icon:<Error/>
				});
			})
			.finally(() => {
				setLoading(false);
			});
	};

	const handleLoginFormChange = (key: keyof typeof loginForm, val: string) => {
		setLoginForm(
			produce(loginForm, (d) => {
				d[key] = val;
			})
		);
	};

	return !userInfo ? (
		<motion.div
			initial={{
				opacity: 0,
				translateX: 10,
			}}
			animate={{
				opacity: 1,
				translateX: 0,
			}}
			className={cx('bg-login ', 'bg-login-light')}
		>
			<div className='flex items-center  justify-center h-screen mx-auto px-2'>
				<div className='flex'>
					<div className='w-96 bg-light p-6 shadow dark:bg-dark mx-auto rounded-md'>
						<h1 className='uppercase text-2xl mb-4 '>
							<span className='bg-gradient-to-br font-bold from-theme-light to-theme-light-fading/40 dark:to-theme-dark-light/40 dark:from-theme-dark text-transparent bg-clip-text'>
								ADMIN
							</span>
						</h1>
						<div className='my-4'>
							<h2 className='mb-2'>Account</h2>
							<Input
								id='LoginAcccount'
								value={loginForm.account}
								disabled={loading}
								onChange={(val) => handleLoginFormChange('account', val)}
								type='text'
							/>
						</div>
						<div className='mb-2'>
							<h2 className='mb-2'>Password</h2>
							<Input
								type='password'
								id='LoginPwd'
								value={loginForm.pwd}
								onChange={(val) => handleLoginFormChange('pwd', val)}
								disabled={loading}
							/>
						</div>

						<Button
							onClick={handleSubmit}
							loading={loading}
							variants='primary'
							classNames='mt-4'
						>
							Sign in
						</Button>
					</div>
				</div>
			</div>
		</motion.div>
	) : (
		<Navigate to='../' replace={true} />
	);
};

export default Login;
