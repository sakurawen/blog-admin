import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App';
import reportWebVitals from '@/reportWebVitals';
import { BrowserRouter as Router } from 'react-router-dom';
import store from '@/store';
import { Provider } from 'react-redux';
import { SWRConfig } from 'swr';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import '@/i18n';
import '@/index.css';

const theme = extendTheme({
	fonts: {
		body: 'Noto Sans SC, sans-serif',
	},
});

const container = document.getElementById('root') as HTMLElement;

const root = createRoot(container);

root.render(
	<React.StrictMode>
		<Router>
			<SWRConfig
				value={{
					focusThrottleInterval: 1000 * 10,
					errorRetryCount: 2,
					dedupingInterval: 1000 * 2,
				}}
			>
				<Provider store={store}>
					<ChakraProvider theme={theme}>
						<App />
					</ChakraProvider>
				</Provider>
			</SWRConfig>
		</Router>
	</React.StrictMode>
);

reportWebVitals();
