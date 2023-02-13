import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryDto } from 'models';

export interface CategoryState {
	data: CategoryDto[];
	isProcessing: boolean;
	isError: boolean;
	errorMessage: string;
}

const categorySlice = createSlice({
	name: 'category',
	initialState: {
		data: [],
		errorMessage: '',
		isError: false,
		isProcessing: false
	} as CategoryState,
	reducers: {
		requestFetchingCategories: (state) => {
			state.isProcessing = true;
		},
		failedFetchingCategories: (state, action: PayloadAction<string>) => {
			state.isProcessing = false;
			state.isError = true;
			state.errorMessage = action.payload;
		},
		completeFetchingCategories: (state, action: PayloadAction<CategoryDto[]>) => {
			state.isProcessing = false;
			state.data = action.payload;
		}
	}
});

export const { requestFetchingCategories, completeFetchingCategories, failedFetchingCategories } =
	categorySlice.actions;
export const categoryActions = categorySlice.actions;
export const categoryState = categorySlice.reducer;
