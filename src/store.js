import { configureStore } from '@reduxjs/toolkit';
import exerciseReducer from './redux/exerciseSlice';
import weatherReducer from './redux/weatherSlice';

export const store = configureStore({
  reducer: {
      exerciseReducer,
      weatherReducer
    },
});