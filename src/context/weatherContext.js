import createDataContext from './createDataContext';
import weather from '../api/weather';
import {weather_key} from '../config';

const weatherReducer = (state, action)=>{
    switch(action.type){
        case 'fetch_weather':
            return {...state, weather: action.payload};
        case 'set_degrees':
            return {...state, degrees: action.payload};
        default:
            return state;
    }
};

const fetchWeather = dispatch => async (lat, lon, units='imperial') => {
    const result = await weather.get('/weather', {
        params: {
            appid: weather_key,
            lat: lat,
            lon: lon,
            units: units
        }
    });
    dispatch({type: 'fetch_weather', payload: result.data});
}

const setDegrees = dispatch => async (name) => {
    dispatch({type: 'set_degrees', payload: name});
}


export const {Context, Provider } = createDataContext(
    weatherReducer,
    {fetchWeather, setDegrees},
    {weather: null,  weatherData: [], degrees: 'imperial'}
);