import React from 'react';
import {TouchableOpacity, StyleSheet, Text, ImageBackground, Alert} from 'react-native';
import { getTodayDate } from '../commonDate';


/*
CalendarDay Component

Displays a single date, along with a star image if the user has recorded
time for that day.
The onDayPress event is used to navigate to the AddExercise screen, where
the user can add a new time.

*/
const CalendarDay = ({date, marking, navigation}) =>{

    const {day, month, year} = date;
    const datestr = year + "-" + ("0" + (month)).slice(-2) + "-" + ("0" + day).slice(-2);
    const todayDate = getTodayDate();

    const getHeartImage = () => {
        const minutes = parseInt(marking.minutes);
    
        if (minutes > 0 && minutes < 10 ) {
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
    };

    const renderDateContent = () =>{
        const color = getHeartImage(marking.minutes);
        const dayTextStyle = (datestr === todayDate)? styles.todayText : styles.dayText;
        return (marking.marked)
        ? <ImageBackground style={styles.heart} source={color}><Text>{day}</Text></ImageBackground> 
        : <Text style={dayTextStyle}>{day}</Text>
        ;
    };

    const onDayPress = () => {
        if (todayDate >= datestr){
            const minutes = (marking.minutes)? marking.minutes.toString() : "0";
            navigation.navigate('AddExercise', {date:{date: datestr, minutes: minutes}});
        } else {
            alert(
                'Cannot enter time for future dates.',
                [{text: 'OK'},],
                { cancelable: false }
            )
        }
    };

    return (
        <TouchableOpacity 
        style={styles.container}
        onPress={onDayPress}
        >
            {renderDateContent()}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dayText:{
        fontSize: 16
    },
    todayText: {
        fontSize: 18,
        fontWeight: "700"
    }, 
    heart: {
        width: 50,
        height: 50,
        flexDirection: 'column', 
        justifyContent: 'center', 
        alignItems: 'center',
        elevation: 30
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50
    }
});

export default CalendarDay;