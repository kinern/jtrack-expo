import React, {useContext, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import WeatherBox from '../components/WeatherBox';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Calendar from '../components/Calendar';
import {setupDatabase} from '../api/database';


const CalendarScreen = ({navigation}) =>{

    const {fetchCalendarExercises, fetchGraphExercises} = useContext(ExerciseContext);
    const startMonth = new Date();
    const nextMonth = new Date(startMonth.setMonth(startMonth.getMonth()+1));

    //TODO: Move database setup and data gathering outside of calendar screen.
    useEffect(()=>{
        //setupDatabase();
        fetchCalendarExercises(startMonth, nextMonth);
        fetchGraphExercises(startMonth, nextMonth);
    }, []);

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