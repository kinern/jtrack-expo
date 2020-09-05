import createDataContext from './createDataContext';
import weather from '../api/weather';

const weatherReducer = (state, action)=>{
    switch(action.type){
        case 'fetch_weather':
            return {...state, weatherData: action.payload};
        default:
            return state;
    }
};

const fetchWeather = dispatch => async () => {
    const result = await weather.get('');
    dispatch({type: 'fetch_weather', payload: result});
}

export const {Context, Provider } = createDataContext(
    weatherReducer,
    {fetchWeather},
    {weatherData: []}
);