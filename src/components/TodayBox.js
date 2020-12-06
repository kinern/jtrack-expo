import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {Context as WeatherContext} from '../context/weatherContext';
import {Context as ExerciseContext} from '../context/exerciseContext';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';


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
    const bgColors = {
        'Thunderstorm': '#fff86e',
        'Drizzle': '#8cbce6',
        'Rain': '#477ba8',
        'Snow': '#ead1ff',
        'Mist': '#b4a7b5',
        'Smoke': '#c98c77',
        'Haze': '#c9b6af',
        'Dust': '#d1b18c',
        'Fog': '#a6aeb3',
        'Sand': '#cfc48a',
        'Ash': '#d1c9c7',
        'Squall': '#deaa9e',
        'Tornado': '#7b888c',
        'Clear': '#3ca2c2',
        'Clouds': '#bcccd1'
    };

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
                {(weatherState.weather? 
                <Text>{weatherTemp}{degreeName}</Text>
                : null)}
                <Text> - </Text>
                {(weatherState.weather? <Text>{weatherName}</Text>: null)}
                <Text> - </Text>
                <Text>Great day to get fit!</Text>
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
                <View style={{...styles.modalView, backgroundColor: getBgColorFromWeather()}}>
                    <TouchableOpacity
                    onPress={()=>{closeModal()}}
                    style={styles.closeBtn}
                    >
                        <Icon name="times-circle" size={30} color="#333030" />
                    </TouchableOpacity>
                    <Text style={[styles.openTitle, {fontSize:18}]}>Today's Exercise Time</Text>
                    
                    <Text style={styles.exerciseTime}>{exerciseState.todayExercise.time}</Text>
                    {renderWeather()}
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        //backgroundColor: "white",
        borderRadius: 5,
        padding: 10,
        width: '80%',
        height: 200,
        alignItems: "center",
        elevation: 5
    },
    closeBtn: {
        alignSelf: 'flex-end'
    },
    exerciseTime: {
        fontWeight: '700',
        fontSize: 24,
        marginTop: 10
    },
    weatherLine: {
        marginTop:20,
        flexDirection: 'row'
    }
});


export default TodayBox;