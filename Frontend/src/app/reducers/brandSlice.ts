import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BrandDto } from 'models';

export interface BrandState {
	data: BrandDto[];
	isProcessing: boolean;
	isError: boolean;
	errorMessage: string;
}

const brandSlice = createSlice({
	name: 'brand',
	initialState: {
		data: [],
		errorMessage: '',
		isError: false,
		isProcessing: false
	} as BrandState,
	reducers: {
		requestFetchingBrands: (state) => {
			state.isProcessing = true;
		},
		failedFetchingBrands: (state, action: PayloadAction<string>) => {
			state.isProcessing = false;
			state.isError = true;
			state.errorMessage = action.payload;
		},
		completeFetchingBrands: (state, action: PayloadAction<BrandDto[]>) => {
			state.isProcessing = false;
			state.data = action.payload;
		}
	}
});

export const { requestFetchingBrands, completeFetchingBrands, failedFetchingBrands } = brandSlice.actions;
export const brandActions = brandSlice.actions;
export const brandState = brandSlice.reducer;
