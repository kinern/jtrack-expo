import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Calendar as ReactCalendar } from 'react-native-calendars';
import CalendarDay from './CalendarDay';
import { Context as ExerciseContext } from '../context/exerciseContext';
import Icon from 'react-native-vector-icons/FontAwesome';


const Calendar = ({navigation}) =>{

  const { state } = useContext(ExerciseContext);

  const renderArrowButton = (direction) => {
    const path = (direction == 'left')? "angle-double-left" : "angle-double-right";
    return (
    <View>
      <Icon name={path} size={30} color="gray" />
    </View>
    );
  }

  return (
    <ReactCalendar 
    style={styles.calendar}
    current={state.selectedDate}
    markedDates = {state.calendarExercises}
    dayComponent={({ date, marking }) => {
        return ( 
        <CalendarDay date={date} marking={marking} navigation={navigation}/>
        );
    }}
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