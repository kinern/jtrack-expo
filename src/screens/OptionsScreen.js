import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';
import {Context as WeatherContext} from '../context/weatherContext';

import Header from '../components/Header';

/*
Options Screen

Has options to clear database and insert test data.
*/
const OptionsScreen = ({navigation}) =>{

    const { 
        state: exerciseState, 
        clearDatabase, 
        insertTestData,
        fetchCalendarExercises,
        fetchGraphExercises,
    } = useContext(ExerciseContext);
    const {state: weatherState, setDegrees, fetchWeather} = useContext(WeatherContext);
    const [exercises, setExercises] = useState(null);


    //Confirmation box before making changes to database.
    const confirmChange = (callback, type) => {
        const title = (type=="clear")? "Clearing Data" : "Adding Test Data";
        const message = (type=="clear")? "This will clear the database. Continue?": "This will alter current data. Continue?";
        Alert.alert(
            title,
            message,
            [
                {
                text: "Cancel",
                style: "cancel"
                },
                { text: "OK", onPress: () => {callback()} }
            ]
        );
    }

    
    //Calls context function to clear data.
    const clearData = async () => {
        try{
            const result = await clearDatabase();
            Alert.alert("Database has been cleared.");
            reloadData();
        } catch(err){
            console.log(err);
        }
    }


    //Calls context function to add in test data.
    const addTestData = async () => {
        try{
            const result = await insertTestData();
            Alert.alert("Test data has been added.");
            reloadData();
        } catch (err) {
            console.log(err);
        }
    }


    //After change of data, update the graphExercises 
    //and calendarExercises state values by calling context functions.
    const reloadData = async () => {
        try {
            await fetchGraphExercises(exerciseState.selectedDate);
            await fetchCalendarExercises(exerciseState.selectedDate);
        } catch (err){
            console.log(err);
        }
    }


    const toggleDegrees = async (degreeName) => {
        await setDegrees(degreeName);
        await fetchWeather(
            weatherState.lat, 
            weatherState.lon, 
            degreeName
        );
    }

    const renderDegreeToggle = () =>{

        const degreeCBg = (weatherState.degrees == 'metric')? '#35c8db': '#a9c1c4';
        const degreeFBg = (weatherState.degrees == 'imperial')? '#eb4034': '#c4a9a9';

        return (
            <View style={styles.degreeToggleMenu}>
                <Text>Weather Degrees</Text>
                <View style={styles.toggleMenu}>
                    <TouchableOpacity 
                    style={{...styles.degreeBtn, backgroundColor: degreeCBg}}
                    onPress={()=>{toggleDegrees('metric')}}
                    ><Text>C</Text></TouchableOpacity>
                    <TouchableOpacity 
                    style={{...styles.degreeBtn, backgroundColor: degreeFBg}}
                    onPress={()=>{toggleDegrees('imperial')}}
                    ><Text>F</Text></TouchableOpacity>
                </View>
            </View>
        );
    }


    const renderOptionButton = (onPressFunction, buttonTitle) => {
        return (
            <TouchableOpacity 
            onPress={onPressFunction}
            style={styles.btn}>
                <Text style={styles.btnText}>{buttonTitle}</Text>
            </TouchableOpacity>
        );
    } 

    
    const findNewLocation = () => {

    }


    const renderLocationForm = () => {
        return (
            <View>
                <Text>Location:</Text>
                <Input 
                placeHolder="location"
                style={{width: 50}}
                />
                <TouchableOpacity
                onSubmit={()=>{findNewLocation()}}
                >
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Header title={navigation.state.routeName}/>
            <View>
                {renderDegreeToggle()}
                {renderOptionButton(()=>{()=>{confirmChange(addTestData, "add")}}, 'Add Test Data')}
                {renderOptionButton(()=>{confirmChange(clearData, "clear")}, 'Clear Database')}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: 'gray'
    },
    degreeToggleMenu: {
        margin: 20, 
        borderWidth: 1, 
        borderRadius: 2,
        borderColor: 'lightgray',
        alignItems: 'center',
        padding: 20
    },
    toggleMenu: {
        flexDirection: 'row'
    },
    degreeBtn: {
        padding: 10,
        marginTop: 5,
        margin: 10,
        width: 50,
        alignItems: 'center',
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
    }
});


export default OptionsScreen;