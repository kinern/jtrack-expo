import React from 'react';
import {TouchableOpacity, StyleSheet, Text, ImageBackground} from 'react-native';
import { getTodayDate } from '../commonDate';
import colors from '../theme/colors';

const images = {
    star1 : require('../assets/images/calendar/star1.png'),
    star2 : require('../assets/images/calendar/star2.png'),
    star3 : require('../assets/images/calendar/star3.png'),
    star4 : require('../assets/images/calendar/star4.png'),
    star5 : require('../assets/images/calendar/star5.png')
};

/*
CalendarDay Component

Displays a single date, along with a star image if the user has recorded
time for that day.
The onDayPress event is used to navigate to the AddExercise screen, where
the user can add a new time.

*/
const CalendarDay = ({date, marking, navigation}) => {

    const {day, month, year} = date;
    const datestr = `${year}-${(`0${month}`).slice(-2)}-${(`0${day}`).slice(-2)}`;
    const todayDate = getTodayDate();
    const starImage = getStarImage(parseInt(marking.minutes));
    const dayTextStyle = (datestr === todayDate)? styles.todayText : styles.dayText;

    const getStarImage = (minutes) => {
        if (minutes > 0 && minutes < 10 ) {
          return images.star1;
        } else if (minutes < 20 ) {
          return images.star2;
        } else if (minutes < 30 ) {
          return images.star3;
        } else if (minutes < 40  ) {
          return images.star4;
        } else {
          return images.star5;
        }
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

    const DayStarComponent = (
        <ImageBackground style={styles.heart} source={starImage}>
            <Text>{day}</Text>
        </ImageBackground> 
    );

    return (
        <TouchableOpacity 
        style={styles.container}
        onPress={onDayPress}
        >
            {(marking.marked) ? DayStarComponent : <Text style={dayTextStyle}>{day}</Text>}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    dayText:{
        fontSize: 16,
        color: colors.medium
    },
    todayText: {
        fontSize: 18,
        color: colors.dark, 
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