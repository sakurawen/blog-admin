import React, { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/router';
import { userService } from '@/api';
import { userActions } from '@/store/reducer/userSlice';
import { useDispatch } from 'react-redux';
import { Spinner } from '@chakra-ui/react';
import { useColorMode } from '@chakra-ui/react';
import LightIcon from '@/assets/images/icon/favicon_light.png';
import DarkIcon from '@/assets/images/icon/favicon_dark.png';

/**
 * App 入口
 * @returns
 */
function App() {
	const [init, setInit] = useState(false);
	const renderRoutes = useRoutes(routes);
	const dispatch = useDispatch();
	// 主题初始化
	const { colorMode } = useColorMode();
	useEffect(() => {
		const iconLink = document.querySelector("link[rel*='icon']");
		iconLink?.setAttribute('href', colorMode === 'dark' ? DarkIcon : LightIcon);
		if (colorMode === 'dark') {
			document.documentElement.classList.add('dark');
			return;
		}
		if (colorMode === 'light') {
			document.documentElement.classList.remove('dark');
		}
	}, [colorMode]);

	/**
	 * 验证jwt
	 */
	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!!token) {
			userService
				.validateJWT()
				.then((res) => {
					dispatch(
						userActions.setTokenAndInfo({
							token,
							info: res.data,
						})
					);
				})
				.catch(() => {
					dispatch(userActions.cleanToken());
				})
				.finally(() => {
					setInit(true);
				});
		} else {
			setInit(true);
		}
	}, [dispatch]);

	return init ? (
		<div className='App  min-h-screen'>{renderRoutes}</div>
	) : (
		<div className='h-screen flex items-center justify-center'>
			<div>
				<Spinner size='lg' />
			</div>
		</div>
	);
}

export default App;
