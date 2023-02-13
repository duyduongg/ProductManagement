import { categoryActions } from 'app/reducers/categorySlice';
import { CategoryDto } from 'models';
import { all, call, put, take } from 'redux-saga/effects';
import { categoryService } from 'services';

function* fetchingCategories() {
	try {
		var res: CategoryDto[] = yield call(categoryService.getCategories);
		if (!res) {
			yield put(categoryActions.failedFetchingCategories('Cannot fetch categories'));
		} else {
			yield put(categoryActions.completeFetchingCategories(res));
		}
	} catch (error) {
		if (error instanceof Error) {
			yield put(categoryActions.failedFetchingCategories(error.message));
		} else {
			console.error(error);
		}
	}
}

function* watchFetchingCategories() {
	while (true) {
		yield take(categoryActions.requestFetchingCategories.type);
		yield call(fetchingCategories);
	}
}

export function* categorySaga() {
	yield all([watchFetchingCategories()]);
}
