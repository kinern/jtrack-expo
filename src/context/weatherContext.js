import createDataContext from './createDataContext';
import weather from '../api/weather';
import {weather_key} from '../config';

const weatherReducer = (state, action)=>{
    switch(action.type){
        case 'fetch_weather':
            return {...state, weather: action.payload};
        default:
            return state;
    }
};

const fetchWeather = dispatch => async (lat, lon) => {
    const result = await weather.get('/weather', {
        params: {
            appid: weather_key,
            lat: lat,
            lon: lon,
            units: 'imperial'

        }
    });
    dispatch({type: 'fetch_weather', payload: result.data});
}


export const {Context, Provider } = createDataContext(
    weatherReducer,
    {fetchWeather},
    {weather: null,  weatherData: []}
);