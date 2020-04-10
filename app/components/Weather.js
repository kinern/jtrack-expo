import { weather_api_key } from '../../api';
import Geolocation from 'react-native-geolocation-service';


//OpenWeatherMap API functions
//Includes Geolocation functions to get user location
export default class Weather {
    constructor(){
    }

    //Main function for getting weather information
    async getWeather(){
        var coords = await this.getLocationCoords();
        var lat = coords.lat;
        var lon = coords.lon;
        var weatherData = await this.getWeatherFromAPI(lat, lon);
        return weatherData;
    }

    //Uses GeoLocation to get the user's coordinates, to be used with API call.
    getLocationCoords = async () => {
        return new Promise((resolve) => {
            Geolocation.getCurrentPosition(
                (position) => {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                resolve({lat, lon});
                }, 
                (error) => {
                console.log(error.code, error.message);
                var lat = 0.00;
                var lon = 0.00;
                resolve({lat,lon});
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        });
    }

    //API call to OpenWeatherMap
    getWeatherFromAPI = async (lat, lon) => {
        const weather_key = weather_api_key;
        const api = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weather_key}&units=imperial`;
        const response = await fetch(api);
        const weatherData = await response.json();
        return weatherData;
    }

    //Returns image that goes with weather found from api call.
    //Uses the weather's generic name (main) and detailed info (id).
    getWeatherImg = (main, id) => {
        switch (main){
        case 'Clouds':
            //Cloudy or partial cloudy check.
            if ((id == 801) || (id == 802)){
            return require('../assets/images/mostlysunny.png');
            } else if (id == 803){
            return require('../assets/images/mostlycloudy.png');
            } else {
            return require('../assets/images/cloudy.png');
            }
        break;
        case 'Rain':
        case 'Drizzle':
        case 'Thunderstorm':
            return require('../assets/images/rainy.png');
        break;
        case 'Clear':
            return require('../assets/images/sunny.png');
        break;
        case 'Snow':
            return require('../assets/images/snowy.png');
        break;
        default:
            return require('../assets/images/sunny.png');
        break;
        }
    }

}