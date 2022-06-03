import { RouteObject } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import LoginRouter from '@/components/auth/LoginRouter';
// admin page
import PostList from '@/page/main/Posts/list';
import Login from '@/page/Login';
import Nodes from '@/page/main/Nodes';
import NotFound from '@/page/Result';

const routes: RouteObject[] = [
	{
		path: '/login',
		element: <Login />,
	},
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				index: true,
				element: (
					<LoginRouter>
						<Nodes />
					</LoginRouter>
				),
			},
			{
				path: 'posts/:node_key',
				element: (
					<LoginRouter>
						<PostList searchNodeKey />
					</LoginRouter>
				),
			},
			{
				path: 'posts',
				element: (
					<LoginRouter>
						<PostList />
					</LoginRouter>
				),
			},
		],
	},

	{
		path: '*',
		element: <NotFound />,
	},
];

export default routes;
