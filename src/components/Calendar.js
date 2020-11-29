import React, { useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import { Calendar as ReactCalendar } from 'react-native-calendars';
import CalendarDay from './CalendarDay';
import { Context as ExerciseContext } from '../context/exerciseContext';
import Icon from 'react-native-vector-icons/FontAwesome';


const Calendar = ({navigation}) =>{

  const { state, updateSelectedDate } = useContext(ExerciseContext);

  const renderArrowButton = (direction) => {
    const path = (direction == 'left')? "angle-double-left" : "angle-double-right";

    //If state.selectedDate == currentDate, replace arrow and disable;

    return (
    <View>
      <Icon name={path} size={30} color="gray" />
    </View>
    );
  }

  const updateMonth = (changeMonth, amount) => {
    if ((amount == 1) && isTodayAfterSelected()){
      return;
    }
    updateSelectedDate(state.selectedDate, amount);
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
    //style={styles.calendar}
    theme={calendarTheme}
    />
  );
}

const calendarTheme = {
  calendarBackground: '#FFFFFF',
  textSectionTitleColor: '#2F4858',
  dayTextColor: '#2F4858',
  monthTextColor: '#2F4858',
  textDayHeaderFontWeight: '400',
  textMonthFontWeight: '700',
  textMonthFontSize: 20,
};

const styles = StyleSheet.create({
    calendar: {
        height: 450,
        width: '98%',
        //backgroundColor: '#FFFFFF',
        //borderRadius: 15,
        margin: '1%',
        //elevation : 2,
    }
});

export default Calendar;