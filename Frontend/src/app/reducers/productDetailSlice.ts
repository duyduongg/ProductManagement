import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NewProductDto, StockDto } from 'models';
import { ProductDetailDto } from 'models/productDetailDto';

export interface ProductDetailState {
	isProcessing: boolean;
	productDetail: ProductDetailDto | null;
	isError: boolean;
	fetchingProductErrorMessage: string;
	creatingOrUpdatingProductErrorMessage: string;
	stockingProductErrorMessage: string;
	checkingProductNameErrorMessage: string;
	isNameDuplicated: boolean;
	createdOrUpdatedProductName: string;
}

const productDetailSlice = createSlice({
	name: 'productDetail',
	initialState: {
		isProcessing: false,
		productDetail: null,
		isError: false,
		fetchingProductErrorMessage: '',
		creatingOrUpdatingProductErrorMessage: '',
		stockingProductErrorMessage: '',
		checkingProductNameErrorMessage: '',
		isNameDuplicated: false,
		createdOrUpdatedProductName: ''
	} as ProductDetailState,
	reducers: {
		requestFetchingProductDetail: (state, action: PayloadAction<string>) => {
			state.isProcessing = true;
		},
		completeFetchingProductDetail: (state, action: PayloadAction<ProductDetailDto>) => {
			state.isProcessing = false;
			state.productDetail = action.payload;
		},
		failedFetchingProductDetail: (state, action: PayloadAction<string>) => {
			state.isProcessing = false;
			state.isError = true;
			state.fetchingProductErrorMessage = action.payload;
		},
		requestCreatingOrUpdatingProduct: (state, action: PayloadAction<NewProductDto>) => {
			state.isProcessing = true;
		},
		completeCreatingOrUpdatingProduct: (state, action: PayloadAction<string>) => {
			state.isProcessing = false;
			state.createdOrUpdatedProductName = action.payload;
		},
		failedCreatingOrUpdatingProduct: (state, action: PayloadAction<string>) => {
			state.isProcessing = false;
			state.isError = true;
			state.creatingOrUpdatingProductErrorMessage = action.payload;
		},
		requestStockingProduct: (state, action: PayloadAction<StockDto>) => {
			state.isProcessing = true;
		},
		completeStockingProduct: (state) => {
			state.isProcessing = false;
		},
		failedStockingProduct: (state, action: PayloadAction<string>) => {
			state.isProcessing = false;
			state.isError = true;
			state.stockingProductErrorMessage = action.payload;
		},
		requestCheckProductNameDuplication: (state, action: PayloadAction<string>) => {
			state.isProcessing = true;
		},
		completeCheckingProductNameDuplication: (state, action: PayloadAction<boolean>) => {
			state.isProcessing = false;
			state.isNameDuplicated = action.payload;
		},
		failedCheckingProductNameDuplication: (state, action: PayloadAction<string>) => {
			state.isProcessing = false;
			state.isError = true;
			state.checkingProductNameErrorMessage = action.payload;
		}
	}
});

export const {
	requestFetchingProductDetail,
	completeFetchingProductDetail,
	failedFetchingProductDetail,
	requestCreatingOrUpdatingProduct,
	completeCreatingOrUpdatingProduct,
	failedCreatingOrUpdatingProduct,
	requestStockingProduct,
	completeStockingProduct,
	failedStockingProduct
} = productDetailSlice.actions;
export const productDetailActions = productDetailSlice.actions;
export const productDetailState = productDetailSlice.reducer;
