import { createSlice, PayloadAction } from '@reduxjs/toolkit';
type SearchState = {
	postKey: string; //标签页搜索词
	nodeKey: string; //节点页搜索词
};

const initialState: SearchState = {
	postKey: '',
	nodeKey: '',
};

/**
 * TODO:回退页面恢复搜索key
 */
const searchSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		changePostKey(state, action: PayloadAction<string>) {
			state.postKey = action.payload;
		},
		changeNodeKey(state, action: PayloadAction<string>) {
			state.nodeKey = action.payload;
		},
		resetPostKey(state) {
			state.postKey = '';
		},
		resetNodeKey(state) {
			state.nodeKey = '';
		},
	},
});

export const appActions = searchSlice.actions;

export default searchSlice.reducer;
