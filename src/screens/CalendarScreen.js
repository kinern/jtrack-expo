import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import WeatherBox from '../components/WeatherBox';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Calendar from '../components/Calendar';


const CalendarScreen = ({navigation}) =>{

    return (
        <View style={styles.main}>
            <Text style={styles.title}>JTrack</Text>
            <WeatherBox />
            <Calendar navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        marginTop: 30
    },
    title: {
       fontSize: 24,
       fontWeight: '700',
       color: 'gray',
       alignSelf: 'center'
    }
});

export default CalendarScreen;