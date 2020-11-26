import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Context as WeatherContext} from '../context/weatherContext';
import {Context as ExerciseContext} from '../context/exerciseContext';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';


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

    const renderWeather = () => {
        if (!state.weather){
            return (
                <View style={styles.weatherLine}>
                    <Text>Loading weather...</Text>
                </View>
                );
        }
        return (
            <View style={styles.weatherLine}>
                {(state.weather? <Text>{state.weather.main.temp}F</Text>: null)}
                <Text> - </Text>
                {(state.weather? <Text>{state.weather.weather[0].main}</Text>: null)}
                <Text> - </Text>
                <Text>Great day to get fit!</Text>
            </View>
        );
    }


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
                <Icon name="times-circle" size={30} color="gray" />
            </TouchableOpacity>
            <Text style={[styles.openTitle, {fontSize:18}]}>Today's Exercise Time</Text>
            
            <Text style={styles.openTitle}>10min</Text>
            {renderWeather()}
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
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 10,
        width: '98%',
        marginLeft: '1%',
        marginRight: '1%',
        padding: 5,
        margin: 10,
        backgroundColor: '#fff',
        elevation: 2,
    },
    openTitle: {
        fontWeight: '700',
        alignSelf: 'center',
        color: 'rgb(47, 72, 88)'
    },
    closeBtn: {
        alignSelf: 'flex-end',
        color: 'rgb(47, 72, 88)'
    },
    toggleText: {
        fontWeight: "700",
    },
    weatherLine: {
        padding: 10,
        flexDirection: 'row',
        width: '%100',
        justifyContent: 'center',
        color: 'rgb(47, 72, 88)'
    }
});


export default WeatherBox;