import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Context as WeatherContext} from '../context/weatherContext';
import {Context as ExerciseContext} from '../context/exerciseContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Location from 'expo-location';


const WeatherBox = () => {

    const {state, fetchWeather} = useContext(WeatherContext);
    const {fetchExercise} = useContext(ExerciseContext);
    const {weather, setWeather} = useState({});
    const [toggle, setToggle] = useState(false);
    const [err, setErr] = useState('');


    useEffect(()=>{
        (async () => {
            try {
                if (Location.requestPermissionsAsync){
                    await Location.requestPermissionsAsync();
                }
                const loc = await Location.getCurrentPositionAsync();
                const {latitude, longitude } = loc.coords;
                fetchWeather(latitude, longitude);
                setWeather(state.weather);
            } catch (e){
                setErr('Error getting weather.');
            }
        })();
    }, []);


    const toggleBox = () =>{
        setToggle((toggle)? false : true);
    }


    if (!toggle){
        return (
        <TouchableOpacity
        style={styles.closedContainer}
        onPress={toggleBox}
        >
            <Text style={styles.toggleText}>Today</Text>
        </TouchableOpacity>);
    }


    return (
        <View style={styles.openContainer}>
            <TouchableOpacity
            onPress={toggleBox}
            style={styles.closeBtn}
            >
                <Text style={styles.toggleText}>[X]</Text>
            </TouchableOpacity>
            <Text style={styles.openTitle}>Today's Exercise Time</Text>
            <Text>10min</Text>
            {(state.weather? <Text>{state.weather.main.temp}F</Text>: null)}
            {(state.weather? <Text>{state.weather.weather[0].main}</Text>: null)}
            <Text>Great day to get fit!</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    closedContainer: {
        borderWidth:3,
        borderColor: 'skyblue',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        backgroundColor: '#fff',
        elevation: 5,
    },
    openContainer: {
        borderWidth: 0,
        borderColor: 'lightgray',
        borderRadius: 10,
        width: '98%',
        marginLeft: '1%',
        marginRight: '1%',
        padding: 10,
        margin: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    openTitle: {
        fontWeight: '700',
        alignSelf: 'center'
    },
    closeBtn: {
        alignSelf: 'flex-end',
    },
    toggleText: {
        fontWeight: "700"
    }
});


export default WeatherBox;