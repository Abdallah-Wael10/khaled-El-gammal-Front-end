import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    userInfo: {
      name: '',
      address: '',
      phone: '',
      email: '',
    },
  },
  reducers: {
    updateUserInfo: (state, action) => {
      state.userInfo = { ...state.userInfo, ...action.payload };
    },
    clearUserInfo: (state) => {
      state.userInfo = { name: '', address: '', phone: '', email: '' };
    },
  },
});

export const { updateUserInfo, clearUserInfo } = checkoutSlice.actions;
export default checkoutSlice.reducer;