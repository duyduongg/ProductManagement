import { brandActions } from 'app/reducers/brandSlice';
import { BrandDto } from 'models';
import { all, call, put, take } from 'redux-saga/effects';
import { brandService } from 'services';

function* fetchingBrands() {
	try {
		var res: BrandDto[] = yield call(brandService.getBrands);
		if (!res) {
			yield put(brandActions.failedFetchingBrands('Cannot fetch brands'));
		} else {
			yield put(brandActions.completeFetchingBrands(res));
		}
	} catch (error) {
		if (error instanceof Error) {
			yield put(brandActions.failedFetchingBrands(error.message));
		} else {
			console.error(error);
		}
	}
}

function* watchFetchingBrands() {
	while (true) {
		yield take(brandActions.requestFetchingBrands.type);
		yield call(fetchingBrands);
	}
}

export function* brandSaga() {
	yield all([watchFetchingBrands()]);
}
