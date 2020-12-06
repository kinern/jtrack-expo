import createDataContext from './createDataContext';
import weather from '../api/weather';
import {weather_key} from '../config';


/*
exerciseContext Context

Contains reducer function, reducer actions, and default state object.
These are all parameters for createDataContext, which sets up and returns
a Context and Provider pair of Components.

*/
const weatherReducer = (state, action)=>{
    switch(action.type){
        case 'fetch_weather':
            return {...state, weather: action.payload};
        case 'set_degrees':
            return {...state, degrees: action.payload};
        case 'set_coords':
            return {...state, lat:action.payload.lat, lon:action.payload.lon};
        default:
            return state;
    }
};



//Requests local weather data and dispatches it to the reducer.
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


//Dispatches new type of degrees to the reducer.
const setDegrees = dispatch => (name) => {
    dispatch({type: 'set_degrees', payload: name});
}

const setCoords = dispatch => (lat, lon)=>{
    dispatch({type: 'set_coords', payload: {lat, lon}});
}


/*
Creates new Context and Provider pair,
using the above reducer function, action functions,
and default state object.
*/
export const {Context, Provider } = createDataContext(
    weatherReducer,
    {
        fetchWeather, 
        setDegrees,
        setCoords
    },
    {weather: null,  weatherData: [], lat: 0, lon: 0, degrees: 'imperial'}
);