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
    const {weather, setWeather} = useState({});
    const [err, setErr] = useState('');

    //Colors for modal box background
    //Todo: change colors to images with weather icon patterns.
    const bgColors = colors.weather;

    //Takes the current weather type and updates the bgColor state variable.
    const getBgColorFromWeather = () => {
        const weatherType = weatherState.weather? weatherState.weather.weather[0].main : '';
        if (bgColors[weatherType]){
            return bgColors[weatherType];
        } else {
            return 'white' //Default color for background
        }
    } 

    useEffect(()=>{
        (async () => {
            try {
                if (Location.requestPermissionsAsync){
                    await Location.requestPermissionsAsync();
                }
                const loc = await Location.getCurrentPositionAsync();
                const {latitude, longitude } = loc.coords;
                setCoords(latitude, longitude);
                fetchWeather(latitude, longitude);
                setWeather(weatherState.weather);
            } catch (e){
                setErr('Error getting weather.');
            }
        })();
    }, []);


    const degreeNames = {'imperial': 'F', 'metric': 'C', 'standard': 'K'};

    const renderWeather = () => {
        if (!weatherState.weather){
            return (
                <View style={styles.weatherLine}>
                    <Text>Loading weather...</Text>
                </View>
                );
        } 
        const weatherTemp = weatherState.weather? weatherState.weather.main.temp : null;
        const weatherName = weatherState.weather? weatherState.weather.weather[0].main : null;
        const degreeName = weatherState.weather? degreeNames[weatherState.degrees]: null;
        return (
            <View style={styles.weatherLine}>
                {(weatherState.weather? <Text style={styles.temp}>{weatherTemp}{degreeName}</Text>: null)}
                <View style={styles.name}>
                    {(weatherState.weather? <Text>{weatherName}</Text>: null)}
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
        height: 100,
        width: '80%',
        alignItems: "center",
        backgroundColor: '#FFF'
    },
    exerciseTime: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: '700',
    },
    weatherLine: {
        marginTop:20,
        flexDirection: 'row'
    },
    temp: {
        fontSize: 36
    },
    name: {
        flexDirection: 'row'
    }
});


export default TodayBox;