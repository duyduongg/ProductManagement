import { useAppSelector } from 'app/hook';
import { StoreType } from 'app/store';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from 'services/apiGateway';
import AuthService from 'services/authService';

const setupHttpInterceptor = (store: StoreType) => {
	api.interceptors.request.use(
		(config: AxiosRequestConfig) => {
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
		(response: AxiosResponse) => {
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
