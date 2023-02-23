import { authActions } from 'app/reducers/authSlice';
import { StoreType } from 'app/store';
import { AxiosResponse, HttpStatusCode, InternalAxiosRequestConfig } from 'axios';
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
		(error) => console.error(error)
	);
	api.interceptors.response.use(
		async (response: AxiosResponse) => {
			if (response.status === HttpStatusCode.Unauthorized) {
				store.dispatch(authActions.requestSignin());
			}
			return response;
		},
		(error) => {
			if (!error?.response) {
				console.log(error);
			}
			return Promise.reject(error);
		}
	);
};

export default setupHttpInterceptor;
