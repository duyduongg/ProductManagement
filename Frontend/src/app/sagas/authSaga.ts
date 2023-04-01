import { authActions } from 'app/reducers/authSlice';
import { User } from 'oidc-client';
import { all, call, put, take } from 'redux-saga/effects';
import AuthService from 'services/authService';

function* signin() {
	try {
		const authService: AuthService = new AuthService();
		yield call(authService.signinRedirectCallback);
		let isAuthenticated: boolean = yield call(authService.isAuthenticated);
		if (isAuthenticated) {
			const user: User | null = yield call(authService.getUser);
			yield put(authActions.setAuthInfo(user!!));
		} else {
			yield put(authActions.clearAuthInfo());
		}
	} catch (err) {
		if (err instanceof Error) {
			yield put(authActions.failedSignin(err.message));
		} else console.error(err);
	}
}

function* watchSignin() {
	while (true) {
		yield take(authActions.requestSignin.type);
		yield call(signin);
	}
}

function* signinSilent() {
	try {
		const authService: AuthService = new AuthService();
		yield call(authService.signinSilentCallback);
		let isAuthenticated: boolean = yield call(authService.isAuthenticated);
		if (isAuthenticated) {
			const user: User | null = yield call(authService.getUser);
			yield put(authActions.setAuthInfo(user!!));
		} else {
			yield put(authActions.clearAuthInfo());
		}
	} catch (err) {
		if (err instanceof Error) {
			yield put(authActions.failedSignin(err.message));
		} else console.error(err);
	}
}

function* watchSigninSilent() {
	while (true) {
		yield take(authActions.requestSigninSilent.type);
		yield call(signinSilent);
	}
}

export function* authSaga() {
	yield all([watchSignin(), watchSigninSilent()]);
}
