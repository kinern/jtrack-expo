import React, {Component} from 'react';
import { StyleSheet, View, Text, ImageBackground, Image } from 'react-native';
import Database from './Database';
import Weather from './Weather';
import Geolocation from 'react-native-geolocation-service';
import { Permissions, PermissionsAndroid } from 'react-native';


const db = new Database();
const weather = new Weather();

const DIstyles = StyleSheet.create({
  dayInfo: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center",
    marginTop: -15,
  },
  todaytext: {
    color: "#fff",
    fontSize: 24,
    textAlign: 'center',
    fontWeight: "700",
  },
  todayMinutes : {
    color: '#fff',
    fontSize: 28,
    marginTop: -10,
    fontWeight: "700",
  },
  todayMinutesText: {
    color: '#fff',
    fontSize: 18,
  },
  datetextend: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  weathercontainer:{
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    width: '100%',
    marginBottom: 5,
  },
  weathertexttemp: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  imageBackground: {
    width: 140,
    height: 100,
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  weatherBackground: {
    width: 30,
    height: 30,
  },
  leftweather: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent:'space-evenly',
    alignItems: 'flex-end',
  }
});

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


class DayInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todayDay: '',
      todayMonth: '',
      todayMinutes: '0',
      weatherdata: {main: {temp: 60}, weather: [{main: 'Clear', description : 'clear sky', id: 800}]}
    };
  }
 
  async requestLocationPermission() 
  {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        //Get weather from geolocation.
        this.weatherApiCall();
      } else {
        //Permission denied.
        alert('Location needed for weather updates.');
        this.weatherApiCall();
      }
    } catch (err) {
      console.warn(err)
    }
  }
  
  //Set Up Day Strings
  async componentDidMount (){
    var day = new Date().getDate(); 
    var month = new Date().getMonth();
    var dayEndingStr = this.getTodayEndingStr();

    //Check for location permissions.
    this.requestLocationPermission();

    this.setState({
      todayDay: day,
      todayEndingStr : dayEndingStr,
      todayMonth: monthNames[month],
    });
  }

  //Get Ending Part of Date
  getTodayEndingStr = () =>{
    var day = new Date().getDate(); 
    var dayStr = day.toString();
    var lastDigit = dayStr[dayStr.length-1];
    var str = 'th';
    switch(lastDigit) {
      case '1':
        str = 'st';
        break;
      case '2':
        str = 'nd';
        break;
      case '3':
        str = 'rd';
        break;
    }
    return str;
  }

  //Get Today's Minutess From The Database
  getTodayMinutes = () => {
    var that = this;
    db.getExercise().then((newTodayMinutes) => {
      that.setState({
        todayMinutes : newTodayMinutes
      });
    }).catch((err) => {
      console.log(err);
      that.setState = {
        todayMinutes : '0'
      }
    });
  }

  weatherApiCall = () => {
    var that = this;
    weather.getWeather().then((data) => {
      that.setState({
        weatherdata : data
      });
    }).catch((err) => {
      console.log(err);
      that.setState = {
        weatherdata : {}
      }
    });
  }

  getHeartImg = (minutes) => {
    minutes = parseInt(minutes);
    if (minutes < 10 ) {
      return require('../assets/images/today-heart.png');
    } else if (minutes < 20 ) {
      return require('../assets/images/today-heart.png');
    } else if (minutes < 30 ) {
      return require('../assets/images/today-heart.png');
    } else if (minutes < 40  ) {
      return require('../assets/images/today-heart.png');
    } else {
      return require('../assets/images/today-heart.png');
    }
  }

  render() {
    var weatherName = this.state.weatherdata.weather[0].main;
    var id = this.state.weatherdata.weather[0].id;
    var weatherImage = weather.getWeatherImg(weatherName, id);

    return (
        <View style={DIstyles.dayInfo}>
          <View>
            <Text style={DIstyles.todaytext}>TODAY</Text>
            <ImageBackground source={this.getHeartImg(this.state.todayMinutes)} style={DIstyles.imageBackground}>
              <Text style={DIstyles.todayMinutes}>{this.state.todayMinutes}</Text>
              <Text style={DIstyles.todayMinutesText}>Min</Text> 
            </ImageBackground>
          </View>
          <View style={DIstyles.weathercontainer}>
            <View style={DIstyles.leftweather}>
              <Image source={weatherImage} style={DIstyles.weatherBackground} />
              <Text style={DIstyles.weathertexttemp}>{this.state.weatherdata.main.temp.toFixed(0)}F</Text>
            </View>
            <Text style={DIstyles.weathertexttemp}>{weatherName}</Text>
          </View>
        </View>
    );
  }
}

export default DayInfo;