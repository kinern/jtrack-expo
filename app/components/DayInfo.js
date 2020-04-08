import React, {Component} from 'react';
import { StyleSheet, View, Text, ImageBackground } from 'react-native';
import Database from './Database';
import Geolocation from 'react-native-geolocation-service';


const db = new Database();

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
  todayJumps: {
    fontSize: 35,
    marginTop:-5,
  },
  todayJumpsText: {
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
      todayJumps: '0',
      weatherdata: {main: {temp: 60}, weather: [{main: 'Clear', description : 'clear sky', id: 800}]}
    };
  }

  //Set Up Day Strings
  async componentDidMount (){
    var that = this;
    var day = new Date().getDate(); 
    var month = new Date().getMonth();
    var dayEndingStr = this.getTodayEndingStr();
    this.getWeatherTemp();

    that.setState({
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

  //Get Today's Jumps From The Database
  getTodayJumps = () => {
    var that = this;
    db.getJumps().then((newTodayJumps) => {
      that.setState({
        todayJumps : newTodayJumps
      });
    }).catch((err) => {
      console.log(err);
      that.setState = {
        todayJumps : '0'
      }
    });
  }

  getWeatherTemp = () => {
    var that = this;
    Geolocation.getCurrentPosition(
      (position) => {
        var lat = position.coords.latitude;
        var lon = position.coords.longitude;
        that.weatherApiCall(lat, lon);
      },
      (error) => {
        console.log(error.code, error.message);
        var lat = 0.00;
        var lon = 0.00;
        that.weatherApiCall(lat, lon);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  }

  weatherApiCall = (lat, lon) => {
    var that = this;
    db.getWeatherFromAPI(lat, lon).then((data) => {
      console.log(data);
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

  getHeartImg = (jumps) => {
    jumps = parseInt(jumps);
    if (jumps < 10 ) {
      return require('../assets/images/heart1.png');
    } else if (jumps < 20 ) {
      return require('../assets/images/heart2.png');
    } else if (jumps < 30 ) {
      return require('../assets/images/heart3.png');
    } else if (jumps < 40  ) {
      return require('../assets/images/heart4.png');
    } else {
      return require('../assets/images/heart5.png');
    }
  }

  //Need to add more icons
  getWeatherImg = () => {
    var main = this.state.weatherdata.weather[0].main;
    var id = this.state.weatherdata.weather[0].id;
    
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


  render() {
    var weathername = this.state.weatherdata.weather[0].main;
    var weatherImage = this.getWeatherImg();

    return (
        <View style={DIstyles.dayInfo}>
          <View style={DIstyles.leftcolumn}>
            <View style={DIstyles.datecontainer}>
              <Text style={DIstyles.datetext}> {this.state.todayMonth}</Text>
              <Text style={DIstyles.datetext}> {this.state.todayDay}</Text>
              <Text style={DIstyles.datetextend}> {this.state.todayEndingStr}</Text>
            </View>
            <View style={DIstyles.weathercontainer}>
              <Text style={DIstyles.weathertextname}>{weathername}</Text>
              <ImageBackground source={weatherImage} style={DIstyles.weatherBackground}>
              <Text style={DIstyles.weathertexttemp}>{this.state.weatherdata.main.temp.toFixed(0)}F</Text>
              </ImageBackground>
            </View>
          </View>
          <View style={DIstyles.rightcontainer}>
            <ImageBackground source={this.getHeartImg(this.state.todayJumps)} style={DIstyles.imageBackground}>
              <Text style={DIstyles.todayJumps}>{this.state.todayJumps}</Text>
              <Text style={DIstyles.todayJumpsText}>Minutes</Text> 
            </ImageBackground>
          </View>
        </View>
    );
  }
}

export default DayInfo;