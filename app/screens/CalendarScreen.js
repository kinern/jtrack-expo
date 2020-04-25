import React, {Component} from 'react';
import { StyleSheet, ImageBackground, View, Text, TouchableOpacity, Alert } from 'react-native';
import {Calendar} from 'react-native-calendars';
import DayInfo from '../components/DayInfo';
import ExerciseMenu from '../components/ExerciseMenu';
import Database from '../components/Database';

const db = new Database();

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1, 
    justifyContent: "flex-start", 
    alignItems: "center",
  },
  calendarContainer: {
    height: 400,
    marginBottom: -70,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    elevation : 10,
  },
  dayHeart: {
    width: 50,
    height: 50,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 30
  },
  calendarDay : {
    width: 30,
    height: 30,
    flexDirection: 'column', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  backgroundImage:{
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
    opacity: 1
},

});



export default class CalendarScreen extends Component {

  constructor(props) {
    super(props);
    this.ExerciseMenuElement = React.createRef();
    this.dayInfoElement = React.createRef();
    this.state = {
      markedDates : {},
      todayDate: this.getTodayDate(),
    };
  }

  componentDidMount() {
    this.databaseSetup();
    this.updateCalendarChanges();
    this.dayInfoElement.current.getTodayMinutes();
  }

  //Set up database and get marked dates for calendar
  databaseSetup(){
    var that = this;
    db.setupDatabase().then((data) => {
      that.updateCalendarChanges();
    }).catch((err) => {
      console.log(err);
    });
  }


  updateCalendarChanges = () => {
    var that = this;
    var year = new Date().getFullYear();
    db.getYearlyMarkedDates(year).then((marked_dates) => {
      that.setState({ markedDates : marked_dates });
      that.dayInfoElement.current.getTodayMinutes();
    }).catch((err) => {
      console.log(err);
    });
  }

  getHeartImg = (minutes) => {
    minutes = parseInt(minutes);

    if (minutes < 10 ) {
      return require('../assets/images/calendar/star1.png');
    } else if (minutes < 20 ) {
      return require('../assets/images/calendar/star2.png');
    } else if (minutes < 30 ) {
      return require('../assets/images/calendar/star3.png');
    } else if (minutes < 40  ) {
      return require('../assets/images/calendar/star4.png');
    } else {
      return require('../assets/images/calendar/star5.png');
    }
  }

  getTodayDate = () => {
    var date = new Date(); 
    var todaydate = date.getFullYear();
    todaydate += "-" + ("0" + (date.getMonth() + 1)).slice(-2);
    todaydate += "-" + ("0" + date.getDate()).slice(-2);
    return todaydate;
  }


  render() {

    return (
      <View style={styles.mainContainer}>
        <ImageBackground style= { styles.backgroundImage } source={require(`../assets/images/purple-pink-bg.png`)}>
            <DayInfo ref={this.dayInfoElement} />
            <Calendar 
            markedDates = {this.state.markedDates}
            dayComponent={({ date, state, marking }) => {
              var day = date.day;
              var month = date.month;
              var year = date.year;

              //Use marking to show hearts or not.
              var dayContent =  <Text >{day}</Text>;
              if (marking.selected){
                var color = this.getHeartImg(marking.minutes);
                dayContent = (
                  <ImageBackground style={styles.dayHeart} source={color}>
                    <Text> {day} </Text>
                  </ImageBackground>
                ); 
              } 
              return ( 
                <TouchableOpacity style={styles.calendarDay}
                  onPress={() => { 
                    var datestr = year + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + day).slice(-2);
                    if (this.state.todayDate >= datestr){
                      this.ExerciseMenuElement.current.openNewMenu({year, month, day}); 
                    } else {
                      Alert.alert(
                        false,
                        'Cannot enter exercise for future dates.',
                        [{text: 'OK'},],
                        { cancelable: false }
                      )
                    }
                }}>
                  {dayContent}
                </TouchableOpacity> );
            }}
            style={ styles.calendarContainer}
            theme={{
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#2F4858',
                dayTextColor: '#2F4858',
                arrowColor: '#a8bfe6',
                monthTextColor: '#2F4858',
                textDayHeaderFontWeight: '400',
                textMonthFontWeight: '700',
                textMonthFontSize: 20,
            }}
            />
            <ExerciseMenu ref={this.ExerciseMenuElement} updateMinuteChanges={this.updateCalendarChanges}/>
        </ImageBackground>
      </View>
    );
  }
}