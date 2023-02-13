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
		setAuthInfo: (state, action: PayloadAction<User>) => {
			state.user = action.payload;
			state.isAuthenticated = true;
		}
	}
});

const authPersistConfig = {
	key: 'auth',
	storage,
	whitelist: ['user', 'isAuthenticated']
};

export const { requestSignin, completeSignin, failedSignin } = authSlice.actions;
export const authActions = authSlice.actions;
export const authState = persistReducer(authPersistConfig, authSlice.reducer);
