import { authActions } from 'app/reducers/authSlice';
import { StoreType } from 'app/store';
import { AxiosResponse, InternalAxiosRequestConfig, AxiosError, isAxiosError, HttpStatusCode } from 'axios';
import api from 'services/apiGateway';

const setupHttpInterceptor = (store: StoreType) => {
	api.interceptors.request.use(
		async (config: InternalAxiosRequestConfig) => {
			config.headers = config.headers ?? {};
			const token = store.getState().authState.user?.access_token;
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}
			return config;
		},
		(error: AxiosError | Error) => console.error(error.message)
	);
	api.interceptors.response.use(
		async (response: AxiosResponse) => {
			return response;
		},
		(error: AxiosError | Error) => {
			if (isAxiosError(error)) {
				if (error.response?.status === HttpStatusCode.Unauthorized) {
					store.dispatch(authActions.requestSignin());
				}
			} else {
				console.error(error.message);
			}
		}
	);
};

export default setupHttpInterceptor;
