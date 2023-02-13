import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { brandSaga } from './brandSaga';
import { categorySaga } from './categorySaga';
import { productSaga } from './productSaga';
import { userSaga } from './userSaga';

export default function* rootSaga() {
	yield all([productSaga(), brandSaga(), categorySaga(), authSaga(), userSaga()]);
}
