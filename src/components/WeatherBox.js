import React, {useContext, useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Context as WeatherContext} from '../context/weatherContext';
import { TouchableOpacity } from 'react-native-gesture-handler';


const WeatherBox = () => {

    //Have Weather box be expandable component
    //Toggle with onpress

    const {state, fetchWeather} = useContext(WeatherContext);
    const [toggle, setToggle] = useState(false);

    useEffect(()=>{
        fetchWeather();
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
            <Text>Today's Exercise Time</Text>
            <Text>10min</Text>
            <Text>95F</Text>
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
        alignItems: 'center'
    },
    openContainer: {
        borderWidth:3,
        borderColor: 'skyblue',
        borderRadius: 10,
        padding: 10
    },
    closeBtn: {
        alignSelf: 'flex-end',
    },
    toggleText: {
        fontWeight: "700"
    }
});

export default WeatherBox;