import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type UserInfo = {
	id: undefined | number;
	username: undefined | string;
	account: undefined | string;
	role: undefined | string;
	group_id: undefined | number;
};

type UserState = {
	token: undefined | string;
	info: undefined | UserInfo;
};

const initialState: UserState = {
	token: undefined,
	info: undefined,
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logout(state) {
			state.info = undefined;
			state.token = undefined;
			localStorage.removeItem('token');
		},
		setTokenAndInfo(state, action: PayloadAction<UserState>) {
			state.info = action.payload.info;
			state.token = action.payload.token;
			localStorage.setItem('token', action.payload.token || '');
		},
		// 设置token
		setToken(state, action: PayloadAction<string>) {
			state.token = action.payload;
			localStorage.setItem('token', action.payload);
		},
		// 清除token
		cleanToken(state) {
			state.token = undefined;
			localStorage.removeItem('token');
		},
		// 设置用户信息
		setInfo(state, action: PayloadAction<UserInfo>) {
			state.info = action.payload;
		},
		// 清除用户信息
		cleanInfo(state) {
			state.info = undefined;
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
