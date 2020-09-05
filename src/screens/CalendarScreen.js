import React, {useContext, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import WeatherBox from '../components/WeatherBox';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Calendar from '../components/Calendar';


const CalendarScreen = ({navigation}) =>{

    return (
        <View>
            <WeatherBox />
            <Calendar navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({});

export default CalendarScreen;