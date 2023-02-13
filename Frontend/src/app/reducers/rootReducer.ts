import { combineReducers } from '@reduxjs/toolkit';
import { authState } from './authSlice';
import { brandState } from './brandSlice';
import { categoryState } from './categorySlice';
import { productDetailState } from './productDetailSlice';
import { productState } from './productSlice';
import { userState } from './userSlice';

export const rootReducer = combineReducers({
	productState: productState,
	productDetailState: productDetailState,
	brandState: brandState,
	categoryState: categoryState,
	userState: userState,
	authState: authState
});

export type RootReducer = ReturnType<typeof rootReducer>;
