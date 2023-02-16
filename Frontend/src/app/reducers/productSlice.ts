import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Guid } from 'guid-typescript';
import { ProductDto, Request, ResponseResult } from 'models';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

export interface ProductState {
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	errorMessage: string;
	result: ResponseResult<ProductDto>;
	request: Request<ProductDto>;
	removingProductErrorMessage: string;
}

export const requestInitialState: Request<ProductDto> = {
	dataSourceRequest: {
		take: 10,
		skip: 0,
		sorts: [{ field: 'Name', order: 1 }]
	},
	filter: {
		id: Guid.createEmpty().toString(),
		name: '',
		price: 0,
		warrantyMonth: 0,
		stock: 0,
		thumbnail: '',
		brandId: Guid.createEmpty().toString(),
		categoryId: Guid.createEmpty().toString(),
		brand: '',
		category: ''
	}
};

const productSlice = createSlice({
	name: 'product',
	initialState: {
		isLoading: false,
		result: {},
		request: requestInitialState,
		errorMessage: '',
		isError: false,
		isSuccess: false,
		removingProductErrorMessage: ''
	} as ProductState,
	reducers: {
		requestFetchingProducts: (state, action: PayloadAction<Request<ProductDto> | undefined>) => {
			state.isLoading = true;
			state.request = action.payload ? action.payload : state.request;
		},
		completeFetchingProducts: (state, action: PayloadAction<ResponseResult<ProductDto>>) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.result = action.payload;
		},
		failedFetchingProducts: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.isError = true;
			state.isSuccess = false;
			state.errorMessage = action.payload;
		},
		requestRemovingProduct: (state, action: PayloadAction<string[]>) => {
			state.isLoading = true;
		},
		completeRemovingProduct: (state) => {
			state.isLoading = false;
		},
		failedRemovingProduct: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.isError = true;
			state.removingProductErrorMessage = action.payload;
		}
	}
});

const productPersistConfig = {
	key: 'product',
	storage,
	whitelist: ['request']
};

export const { requestFetchingProducts, completeFetchingProducts, failedFetchingProducts } = productSlice.actions;
export const productActions = productSlice.actions;
export const productState = persistReducer(productPersistConfig, productSlice.reducer);
