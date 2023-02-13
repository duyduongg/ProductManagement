import { appSelect } from 'app/hook';
import { userActions } from 'app/reducers/userSlice';
import jwtDecode from 'jwt-decode';
import { UserAuthenticate } from 'models/userAuthenticate';
import { UserDto } from 'models/userDto';
import { User } from 'oidc-client';
import { all, call, put, take } from 'redux-saga/effects';

function* setUser() {
	try {
		const storedUser: User | null = yield* appSelect((state) => state.authState.user);
		if (storedUser !== null) {
			try {
				jwtDecode(storedUser.access_token);
			} catch (err) {
				throw err;
			}
			let decodedPayload: UserAuthenticate = jwtDecode(storedUser.access_token);
			yield put(
				userActions.completeSettingUser({
					email: decodedPayload.email,
					fullName: decodedPayload.name,
					userName: decodedPayload.preferred_username,
					id: decodedPayload.sub,
					role: decodedPayload.role
				} as UserDto)
			);
		}
	} catch (err) {
		if (err instanceof Error) {
			yield put(userActions.failedSettingUser(err.message));
		} else {
			console.log(err);
		}
	}
}

function* watchSetUser() {
	while (true) {
		yield take(userActions.requestSettingUser.type);
		yield call(setUser);
	}
}

export function* userSaga() {
	yield all([watchSetUser()]);
}
