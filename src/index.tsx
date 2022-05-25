import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotificationsProvider } from '@mantine/notifications';
import store from '@/store';
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import '@/i18n';
import '@/index.css';

const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);

root.render(
	<Router>
		<SWRConfig
			value={{
				focusThrottleInterval: 1000 * 10,
				errorRetryCount: 2,
				dedupingInterval: 1000 * 2,
			}}
		>
			<NotificationsProvider
				position='top-center'
				zIndex={2077}
				autoClose={5000}
			>
				<Provider store={store}>
					<App />
				</Provider>
			</NotificationsProvider>
		</SWRConfig>
	</Router>
);
