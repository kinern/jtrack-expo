import React, {Component} from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import Database from './Database';
import Weather from './Weather';
import Geolocation from 'react-native-geolocation-service';
import { Permissions, PermissionsAndroid } from 'react-native';


const db = new Database();
const weather = new Weather();

const DIstyles = StyleSheet.create({
  dayInfo: {
    width: '95%',
    height: 120,
    marginBottom: 20,
    backgroundColor: '#86BBD8', //'#336699'
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 3,
    elevation : 10,
    marginTop: -15,
  },
  leftcolumn: { 
    display:'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: 200,
  },
  datecontainer:{
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: 150,
    marginLeft: -5,
  },
  datetext: {
    color: '#fff',
    fontSize: 24,

  },
  datetextend: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: -5,
  },
  weathercontainer:{
    display:'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    width: 180,
  },
  weathertextname: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  weathertexttemp: {
    color: '#000',
    fontSize: 22,
  },
  todayMinutes: {
    fontSize: 35,
    marginTop:-5,
  },
  todayMinutesText: {
    fontSize:12,
    marginTop:-5,
  },
  dayTemp: {
    fontSize: 35,
    fontWeight: "700",
    margin:0,
    padding:0,
  },
  imageBackground: {
    width: 100,
    height: 100,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: -20,
  },
  weatherBackground: {
    width: 70,
    height: 70,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginLeft: 20,
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
      return require('../assets/images/heart1.png');
    } else if (minutes < 20 ) {
      return require('../assets/images/heart2.png');
    } else if (minutes < 30 ) {
      return require('../assets/images/heart3.png');
    } else if (minutes < 40  ) {
      return require('../assets/images/heart4.png');
    } else {
      return require('../assets/images/heart5.png');
    }
  }

  render() {
    var weatherName = this.state.weatherdata.weather[0].main;
    var id = this.state.weatherdata.weather[0].id;
    var weatherImage = weather.getWeatherImg(weatherName, id);

    return (
        <View style={DIstyles.dayInfo}>
          <View style={DIstyles.leftcolumn}>
            <View style={DIstyles.datecontainer}>
              <Text style={DIstyles.datetext}> {this.state.todayMonth}</Text>
              <Text style={DIstyles.datetext}> {this.state.todayDay}</Text>
              <Text style={DIstyles.datetextend}> {this.state.todayEndingStr}</Text>
            </View>
            <View style={DIstyles.weathercontainer}>
              <Text style={DIstyles.weathertextname}>{weatherName}</Text>
              <ImageBackground source={weatherImage} style={DIstyles.weatherBackground}>
              <Text style={DIstyles.weathertexttemp}>{this.state.weatherdata.main.temp.toFixed(0)}F</Text>
              </ImageBackground>
            </View>
          </View>
          <View style={DIstyles.rightcontainer}>
            <ImageBackground source={this.getHeartImg(this.state.todayMinutes)} style={DIstyles.imageBackground}>
              <Text style={DIstyles.todayMinutes}>{this.state.todayMinutes}</Text>
              <Text style={DIstyles.todayMinutesText}>Minutes</Text> 
            </ImageBackground>
          </View>
        </View>
    );
  }
}

export default DayInfo;