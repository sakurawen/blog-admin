import { useEffect, useState } from 'react';
import { useRoutes } from 'react-router-dom';
import routes from '@/router';
import { userService } from '@/api';
import { userActions } from '@/store/reducer/userSlice';
import { useDispatch } from 'react-redux';
/**
 * App 入口
 * @returns
 */
function App() {
	const [init, setInit] = useState(false);
	const renderRoutes = useRoutes(routes);
	const dispatch = useDispatch();

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

	return !init ? (
		<div className='h-screen flex items-center justify-center'>
			<div>loading...</div>
		</div>
	) : (
		<div className='App  min-h-screen'>{renderRoutes}</div>
	);
}

export default App;
