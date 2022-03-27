import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {Context as WeatherContext} from '../context/weatherContext';
import {Context as ExerciseContext} from '../context/exerciseContext';
import * as Location from 'expo-location';

import colors from '../theme/colors';


/*
TodayBox Component

Displays modal box with the minutes exercised today, and the local weather.

*/
const TodayBox = ({modalVisible, changeModalVisible}) => {

    const {state: weatherState, fetchWeather, setCoords} = useContext(WeatherContext);
    const {state: exerciseState} = useContext(ExerciseContext);
    const degreeNames = {'imperial': 'F', 'metric': 'C', 'standard': 'K'};
    const {weather, setWeather} = useState({});
    const [err, setErr] = useState('');
    const modalBgColors = colors.weather;

    //Takes the current weather type and updates the bgColor state variable.
    const getBgColorFromWeather = () => {
        const weatherType = weatherState.weather? weatherState.weather.weather[0].main : '';
        const color = (modalBgColors[weatherType])? modalBgColors[weatherType]: 'white';
        return color;
    } 


    //Gets permission to use locaton
    //Sets coordinates
    useEffect(()=>{
        (async () => {
            try {
                if (Location.requestPermissionsAsync){
                    await Location.requestPermissionsAsync();
                }
                const loc = await Location.getCurrentPositionAsync();
                if (Object.prototype.hasOwnProperty.call(loc, 'coords')){
                    setCoords(loc.coords.latitude, loc.coords.longitude);
                }
            } catch (e){
                setErr('Error getting weather.');
            }
        })();
    }, []);

    //Dispatch action to fetch weather with coords
    useEffect(()=>{
        if (Object.prototype.hasOwnProperty.call(weatherState, 'lat') && Object.prototype.hasOwnProperty.call(weatherState, 'lon')){
            fetchWeather(weatherState.lat, weatherState.lon);
        }  
    }, [weatherState.lat]);

    //Sets the local state variable
    useEffect(()=>{
        if (Object.prototype.hasOwnProperty.call(weatherState, 'weather')){
            setWeather({weather : weatherState.weather, degrees: weatherState.degrees});
        }
    }, [seatherState.weather]);

    const renderWeather = () => {
        if (!(Object.hasOwnProperty(weather, 'weather')) || (weather.weather == null)){
            return (
                <View style={styles.weatherLine}>
                    <Text>Loading weather...</Text>
                </View>
                );
        } 
        const weatherTemp = weather.weather.main.temp;
        const weatherName = weather.weather.weather[0].main;
        const degreeName = degreeNames[weather.degrees];
        return (
            <View style={styles.weatherBox}>
                <Text style={styles.temp}>{weatherTemp}{degreeName}</Text>
                <View style={styles.name}>
                    <Text>{weatherName}</Text>
                    <Text> - Great day to get fit!</Text>
                </View>
            </View>
        );
    }

    const closeModal = () => {
        changeModalVisible(!modalVisible);
    }

    return (
        <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => changeModalVisible(!modalVisible)}
        >
            <View style={styles.centeredView}>
                <TouchableOpacity onPress={()=>{closeModal()}}>
                    <View style={{...styles.modalView, borderColor: getBgColorFromWeather()}}>
                        {renderWeather()}
                    </View>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        marginTop: 22,
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        margin: 20,
        padding: 10,
        borderRadius: 2,
        borderWidth: 5,
        elevation: 2,
        width: '80%',
        alignItems: "center",
        backgroundColor: '#FFF'
    },
    exerciseTime: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: '700',
    },
    weatherBox: {
        padding: 20,
        alignItems: 'center'
    },
    temp: {
        fontSize: 36
    },
    name: {
        flexDirection: 'row'
    }
});


export default TodayBox;