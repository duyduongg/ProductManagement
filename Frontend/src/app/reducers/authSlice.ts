import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from 'oidc-client';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
interface AuthState {
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
	user: User | null;
	isAuthenticated: boolean;
	authExpireTime: string | null;
}

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		isLoading: false,
		isError: false,
		errorMessage: '',
		isAuthenticated: false
	} as AuthState,
	reducers: {
		requestSignin: (state) => {
			state.isLoading = true;
		},
		completeSignin: (state) => {
			state.isLoading = false;
		},
		failedSignin: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		},
		requestSigninSilent: (state) => {
			state.isLoading = true;
		},
		setAuthInfo: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
			state.authExpireTime = new Intl.DateTimeFormat('en-EN', {
				dateStyle: 'full',
				timeStyle: 'long',
				timeZone: 'Asia/Jakarta'
			}).format(new Date(action.payload.expires_at * 1000));
		},
		clearAuthInfo: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.authExpireTime = null;
			localStorage.removeItem('persist:auth');
		}
	}
});

const authPersistConfig = {
	key: 'auth',
	storage,
	whitelist: ['user', 'isAuthenticated', 'authExpireTime']
};

export const { requestSignin, completeSignin, failedSignin, requestSigninSilent, setAuthInfo, clearAuthInfo } =
	authSlice.actions;
export const authActions = authSlice.actions;
export const authState = persistReducer(authPersistConfig, authSlice.reducer);
