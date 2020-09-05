import React, {useState} from 'react';
import { StyleSheet} from 'react-native';
import {Calendar as ReactCalendar} from 'react-native-calendars';
import {getTodayDate} from '../commonDate';
import CalendarDay from './CalendarDay';

const Calendar = ({navigation}) =>{

  const [markedDates, setMarkedDates] = useState({
      '2020-09-17': {marked: true, minutes: 10},
      '2020-09-18': {marked: true, minutes: 20},
      '2020-09-06': {marked: true, minutes: 30},
      '2020-09-05': {marked: true, minutes: 50},
    });
  const [todayDate, setTodayDate] = useState(getTodayDate());

  //TODO: useEffect to fetch exercises from database and assign with setMarkedDates

  return (
    <ReactCalendar 
    markedDates = {markedDates}
    dayComponent={({ date, marking }) => {
        return ( 
        <CalendarDay date={date} marking={marking} navigation={navigation}/>
        );
    }}
    style={styles.calendar}
    theme={calendarTheme}
    />
  );
}

const calendarTheme = {
  calendarBackground: '#FFFFFF',
  textSectionTitleColor: '#2F4858',
  dayTextColor: '#2F4858',
  arrowColor: '#a8bfe6',
  monthTextColor: '#2F4858',
  textDayHeaderFontWeight: '400',
  textMonthFontWeight: '700',
  textMonthFontSize: 20,
};

const styles = StyleSheet.create({
    calendar: {
        height: 400,
        marginBottom: -70,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        elevation : 10,
    }
});

export default Calendar;