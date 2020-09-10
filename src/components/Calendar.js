import React, {useEffect, useContext} from 'react';
import { StyleSheet} from 'react-native';
import {Calendar as ReactCalendar} from 'react-native-calendars';
import CalendarDay from './CalendarDay';
import {Context as ExerciseContext} from '../context/exerciseContext';

const Calendar = ({navigation}) =>{

  const {state, fetchExercises} = useContext(ExerciseContext);

  useEffect(()=>{
    fetchExercises();
  }, []);

  //TODO: useEffect to fetch exercises from database and assign with setMarkedDates

  return (
    <ReactCalendar 
    current={state.selectedDate}
    markedDates = {state.exercises}
    dayComponent={({ date, marking }) => {
        return ( 
        <CalendarDay date={date} marking={marking} navigation={navigation}/>
        );
    }}
    //style={styles.calendar}
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