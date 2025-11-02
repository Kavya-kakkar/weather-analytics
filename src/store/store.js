import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from './weatherslice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    auth: authReducer,
  },
});