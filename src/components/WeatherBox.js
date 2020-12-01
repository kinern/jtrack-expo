import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet, Modal, TouchableOpacity} from 'react-native';
import {Context as WeatherContext} from '../context/weatherContext';
import {Context as ExerciseContext} from '../context/exerciseContext';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/FontAwesome';


const WeatherBox = ({modalVisible, changeModalVisible}) => {

    const {state: weatherState, fetchWeather} = useContext(WeatherContext);
    const {state: exerciseState} = useContext(ExerciseContext);
    const {weather, setWeather} = useState({});
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
                setWeather(weatherState.weather);
            } catch (e){
                setErr('Error getting weather.');
            }
        })();
    }, []);

    const renderWeather = () => {
        if (!weatherState.weather){
            return (
                <View style={styles.weatherLine}>
                    <Text>Loading weather...</Text>
                </View>
                );
        }
        return (
            <View style={styles.weatherLine}>
                {(weatherState.weather? <Text>{weatherState.weather.main.temp}F</Text>: null)}
                <Text> - </Text>
                {(weatherState.weather? <Text>{weatherState.weather.weather[0].main}</Text>: null)}
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
                <View style={styles.modalView}>
                    <TouchableOpacity
                    onPress={()=>{closeModal()}}
                    style={styles.closeBtn}
                    >
                        <Icon name="times-circle" size={30} color="gray" />
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
        backgroundColor: "white",
        borderRadius: 20,
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


export default WeatherBox;