import { createSlice } from '@reduxjs/toolkit'
import weatherAPI from '../api/weather';
import weather_key from '../config';


export const fetchWeather = createAsyncThunk(
  'weather/fetchWeather',
  async (options, thunkAPI) => {
    const state = thunkAPI.getState();
    const response = await weatherAPI.get('/weather', {
      params: {
          appid: weather_key,
          lat: state.coords.lat,
          lon: state.coords.lon,
          units: state.degrees
      }
    });
    return response.data;
  }
);

const initialState = {
  coords: {lat: 0, lon: 0},
  degrees: 'imperial',
  weather: null,  
  weatherData: null, 
}

export const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setDegrees : (state, action) => {
      state.degrees = action.payload; // degrees = {lat: float, lon: float}
    },
    setCoords : (state, action) => {
      state.coords = action.payload; 
    }
  },
  extraReducers: {
    [fetchWeather.fulfilled] :  (state, {payload}) => {
      state.weather = payload;
    },
  }
})

export default weatherSlice.reducer;
export const weatherSelector = state => state.weather;