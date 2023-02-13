import { useAppDispatch, useAppSelector } from 'app/hook';
import { userActions } from 'app/reducers/userSlice';
import { UserDto } from 'models/userDto';
import { useEffect } from 'react';
import { User } from './components/User';
import classes from './Header.module.scss';
export function Header() {
	const dispatch = useAppDispatch();
	const user: UserDto = useAppSelector((state) => state.userState.user);
	useEffect(() => {
		dispatch(userActions.requestSettingUser());
	}, []);
	return (
		<header>
			<div className={classes.container}>
				<User user={user} />
			</div>
		</header>
	);
}
