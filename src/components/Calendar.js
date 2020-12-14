import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar as ReactCalendar } from 'react-native-calendars';
import CalendarDay from './CalendarDay';
import { Context as ExerciseContext } from '../context/exerciseContext';
import Icon from 'react-native-vector-icons/FontAwesome';

import colors from '../theme/colors';


/*
Calendar Component

Displays a monthly calendar with month changing arrows.

Uses CalendarDay component for displaying the days on the calendar and 
onPress functionality.
The navigation props variable is passed down to the CalendarDay component to be 
used with the AddExerciseScreen component.

*/
const Calendar = ({navigation}) =>{

  const { state, updateSelectedDate, fetchCalendarExercises } = useContext(ExerciseContext);

  const renderArrowButton = (direction) => {
    const path = (direction == 'left')? "angle-double-left" : "angle-double-right";
    const arrowColor = ((direction == 'right')&&(isTodayAfterSelected()))? colors.inactiveLight : colors.medium;
    return (
      <View>
        <Icon name={path} size={30} color={arrowColor} />
      </View>
    );
  }


  const updateMonth = (changeMonth, amount) => {
    if ((amount == 1) && isTodayAfterSelected()){
      return;
    }
    updateSelectedDate(state.selectedDate, amount);
    fetchCalendarExercises(state.selectedDate);
    changeMonth();
  }


  //Compare today to state.selectedDate
  const isTodayAfterSelected = () => {
    const today = new Date();
    const selectedMonth = ('0' + (state.selectedDate.getMonth()+1)).slice(-2);
    const selectedComp = state.selectedDate.getFullYear().toString() + selectedMonth.toString();
    const todayMonth = ('0' + (today.getMonth()+1)).slice(-2);
    const todayComp = today.getFullYear().toString() + todayMonth;
    return (selectedComp >= todayComp);
  }


  const formatSelectedDate = (date) => {
    let month = String(date.getMonth()+1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let year = date.getFullYear();
    return (year +'-'+ month +'-'+ day);
  };

  
  return (
    <ReactCalendar 
    style={styles.calendar}
    current={formatSelectedDate(state.selectedDate)}
    markedDates = {state.calendarExercises}
    dayComponent={({ date, marking }) => {
        return ( 
        <CalendarDay date={date} marking={marking} navigation={navigation}/>
        );
    }}
    onPressArrowLeft={(subtractMonth)=>{updateMonth(subtractMonth, -1)}}
    onPressArrowRight={(addMonth)=>{updateMonth(addMonth, 1)}}
    renderArrow={(direction) => (renderArrowButton(direction))}
    theme={calendarTheme}
    />
  );
}

const calendarTheme = {
  calendarBackground: 'white',
  textSectionTitleColor: colors.medium,
  dayTextColor: colors.dark,
  monthTextColor: colors.dark,
  textDayHeaderFontWeight: '400',
  textMonthFontWeight: '700',
  textMonthFontSize: 20,
};

const styles = StyleSheet.create({
    calendar: {
        height: 450,
        width: '98%',
        margin: '1%',
    }
});

export default Calendar;