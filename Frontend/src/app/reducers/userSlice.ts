import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from 'models/userDto';

interface UserState {
	user: UserDto;
	isLoading: boolean;
	isError: boolean;
	errorMessage: string;
}

const userSlice = createSlice({
	name: 'user',
	initialState: {
		user: {} as UserDto,
		isLoading: false,
		isError: false,
		errorMessage: ''
	} as UserState,
	reducers: {
		requestSettingUser: (state) => {
			state.isLoading = true;
		},
		completeSettingUser: (state, action: PayloadAction<UserDto>) => {
			state.isLoading = false;
			state.user = action.payload;
		},
		failedSettingUser: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		},
		requestGettingUserById: (state, action: PayloadAction<string>) => {
			state.isLoading = true;
		},
		completeGettingUserById: (state, action: PayloadAction<UserDto>) => {
			state.isLoading = false;
			state.user = action.payload;
		},
		failedGettingUserById: (state, action: PayloadAction<string>) => {
			state.isLoading = false;
			state.isError = true;
			state.errorMessage = action.payload;
		}
	}
});

export const {
	requestSettingUser,
	completeSettingUser,
	requestGettingUserById,
	completeGettingUserById,
	failedGettingUserById
} = userSlice.actions;
export const userActions = userSlice.actions;
export const userState = userSlice.reducer;
