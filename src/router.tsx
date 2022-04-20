import { RouteObject } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import LoginRouter from '@/components/auth/LoginRouter';
// admin page
import NewArticle from '@/page/main/NewArticle';
import EditArticle from '@/page/main/EditArticle';
import PostList from '@/page/main/Posts/list';
import Posts from '@/page/main/Posts/post';
import Login from '@/page/Login';
import Nodes from '@/page/main/Nodes';
import NotFound from '@/page/Result';
import Configuration from '@/page/main/Confguration';

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
				path: 'new',
				element: (
					<LoginRouter>
						<NewArticle />
					</LoginRouter>
				),
			},
			{
				path: '/conf',
				element: (
					<LoginRouter>
						<Configuration />
					</LoginRouter>
				),
			},
			{
				path: 'edit/:key',
				element: (
					<LoginRouter>
						<EditArticle />
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
			{
				path: 'post/:key',
				element: <Posts />,
			},
		],
	},

	{
		path: '*',
		element: <NotFound />,
	},
];

export default routes;
