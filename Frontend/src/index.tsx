import { persistor, store } from 'app/store';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import setupHttpInterceptor from 'services/middlewares/httpInterceptor';
import App from './App';
import i18n from './i18n';
import './index.scss';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<React.StrictMode>
		<Suspense fallback={null}>
			<I18nextProvider i18n={i18n}>
				<Provider store={store}>
					<PersistGate loading={null} persistor={persistor}>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</PersistGate>
				</Provider>
			</I18nextProvider>
		</Suspense>
	</React.StrictMode>
);

setupHttpInterceptor(store);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
