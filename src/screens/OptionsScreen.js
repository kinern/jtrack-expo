import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import {Context as WeatherContext} from '../context/weatherContext';
import * as Location from 'expo-location';


const OptionsScreen = () =>{

    const {state, setDegrees, fetchWeather} = useContext(WeatherContext);
    const selectedFStyle = (state.degrees == 'metric')? null : {backgroundColor:'red'};
    const selectedCStyle = (state.degrees == 'metric')? {backgroundColor:'teal'}: null;

    const updateDegrees = async (name) =>{
        setDegrees(name);
        const loc = await Location.getCurrentPositionAsync();
        const {latitude, longitude } = loc.coords;
        fetchWeather(latitude, longitude);
    }

    const renderDegreeToggle = () =>{
        return (
            <View style={{flexDirection:'row' }}>
                <TouchableOpacity 
                onPress={()=>{updateDegrees('metric')}}
                style={[styles.degreeBtnC, selectedCStyle]}>
                    <Text style={styles.btnText}>C</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>{updateDegrees('imperial')}}
                style={[styles.degreeBtnF, selectedFStyle]}>
                    <Text style={styles.btnText}>F</Text>
                </TouchableOpacity>
            </View> 
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Options</Text>
            <View style={styles.degreeMenu}>
                <Text h4>Weather Degrees</Text>
                {renderDegreeToggle()}
            </View>
            <TouchableOpacity style={styles.btn}>
                <Text style={styles.btnText}>Clear Data</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: 'gray'
    },
    degreeBtnC: {
        padding: 10,
        marginTop: 5,
        width: 50,
        alignItems: 'center',
        backgroundColor: 'lightblue',
        elevation: 2
    },
    degreeBtnF:{
        padding: 10,
        marginTop: 5,
        width: 50,
        alignItems: 'center',
        backgroundColor: 'coral',
        elevation: 2
    },
    btn: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 20,
        width: 180,
        color: 'gray',
        elevation: 2
    },
    btnText: {
        fontSize: 20
    },
    degreeMenu: {
        margin: 20, 
        borderWidth: 1, 
        borderRadius: 2,
        borderColor: 'lightgray',
        alignItems: 'center',
        padding: 20
    }
});

export default OptionsScreen;