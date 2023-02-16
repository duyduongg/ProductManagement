import { PayloadAction } from '@reduxjs/toolkit';
import { appSelect } from 'app/hook';
import { productDetailActions } from 'app/reducers/productDetailSlice';
import { productActions, requestInitialState } from 'app/reducers/productSlice';
import { NewProductDto, ProductDetailDto, ProductDto, ResponseResult, StockDto } from 'models';
import { all, call, fork, put, take } from 'redux-saga/effects';
import { productService } from 'services/productService';

function* fetchingProducts() {
	try {
		let req = yield* appSelect((state) => state.productState.request);
		const res: ResponseResult<ProductDto> = yield call(productService.getProducts, req);
		if (!res?.data) {
			yield put(productActions.failedFetchingProducts('Cannot fetch products'));
		} else {
			yield put(productActions.completeFetchingProducts(res));
		}
	} catch (error) {
		if (error instanceof Error) {
			yield put(productActions.failedFetchingProducts(error.message));
		} else console.error(error);
	}
}

function* watchFetchingProducts() {
	while (true) {
		yield take(productActions.requestFetchingProducts.type);
		yield call(fetchingProducts);
	}
}

function* fetchingProductDetail(productId: string) {
	try {
		const product: ProductDetailDto = yield call(productService.getProductDetail, productId);
		if (!product) {
			yield put(productDetailActions.failedFetchingProductDetail(`Cannot fetch productID = ${productId}`));
		}
		yield put(productDetailActions.completeFetchingProductDetail(product));
	} catch (error: any) {
		if (error instanceof Error) {
			yield put(productDetailActions.failedFetchingProductDetail(error.message));
		} else console.error(error);
	}
}

function* watchFetchingProductDetail() {
	while (true) {
		const action: PayloadAction<string> = yield take(productDetailActions.requestFetchingProductDetail.type);
		yield fork(fetchingProductDetail, action.payload);
	}
}

function* createOrUpdateProduct(product: NewProductDto) {
	try {
		yield call(productService.createOrUpdateProductAsync, product);
		yield put(productDetailActions.completeCreatingOrUpdatingProduct(product.name));
		yield put(productActions.requestFetchingProducts(requestInitialState));
	} catch (error: any) {
		if (error instanceof Error) {
			yield put(productDetailActions.failedCreatingOrUpdatingProduct(error.message));
		} else console.error(error);
	}
}

function* watchCreateOrUpdateProduct() {
	while (true) {
		const action: PayloadAction<NewProductDto> = yield take(productDetailActions.requestCreatingOrUpdatingProduct.type);
		yield call(createOrUpdateProduct, action.payload);
	}
}

function* stockProduct(stockDto: StockDto) {
	try {
		yield call(productService.stockProductAsync, stockDto);
		yield call(fetchingProducts);
	} catch (error: any) {
		if (error instanceof Error) {
			yield put(productDetailActions.failedStockingProduct(error.message));
		} else {
			console.error(error);
		}
	}
}

function* watchStockProduct() {
	while (true) {
		const action: PayloadAction<StockDto> = yield take(productDetailActions.requestStockingProduct.type);
		yield call(stockProduct, action.payload);
	}
}

function* checkProductNameDuplication(productName: string) {
	try {
		var result: boolean = yield call(productService.checkProductNameDuplicationAsync, productName);
		if (result) {
			yield put(productDetailActions.completeCheckingProductNameDuplication(result));
		} else {
			yield put(productDetailActions.failedCheckingProductNameDuplication('Cannot check product name duplication'));
		}
	} catch (error) {
		if (error instanceof Error) {
			yield put(productDetailActions.failedCheckingProductNameDuplication(error.message));
		} else {
			console.error(error);
		}
	}
}

function* watchCheckProductNameDuplication() {
	while (true) {
		const action: PayloadAction<string> = yield take(productDetailActions.requestCheckProductNameDuplication.type);
		yield call(checkProductNameDuplication, action.payload);
	}
}

function* removeProduct(productsId: string[]) {
	try {
		yield call(productService.removeProductAsync, productsId);
		yield call(fetchingProducts);
	} catch (error) {
		if (error instanceof Error) {
			yield put(productActions.failedRemovingProduct(error.message));
		} else {
			console.error(error);
		}
	}
}

function* watchRemoveProduct() {
	while (true) {
		const action: PayloadAction<string[]> = yield take(productActions.requestRemovingProduct.type);
		yield call(removeProduct, action.payload);
	}
}

export function* productSaga() {
	yield all([
		watchFetchingProducts(),
		watchFetchingProductDetail(),
		watchCreateOrUpdateProduct(),
		watchStockProduct(),
		watchCheckProductNameDuplication(),
		watchRemoveProduct()
	]);
}
