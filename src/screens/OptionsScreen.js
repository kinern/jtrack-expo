import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Text} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';
import {Context as WeatherContext} from '../context/weatherContext';


/*
Options Screen

Has options to clear database and insert test data.
*/
const OptionsScreen = () =>{

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
        return (
            <View style={styles.degreeToggleMenu}>
                <Text>Weather Degrees</Text>
                <View style={styles.toggleMenu}>
                    <TouchableOpacity 
                    style={{...styles.degreeBtn, backgroundColor: 'lightblue'}}
                    onPress={()=>{toggleDegrees('metric')}}
                    ><Text>C</Text></TouchableOpacity>
                    <TouchableOpacity 
                    style={{...styles.degreeBtn, backgroundColor: 'pink'}}
                    onPress={()=>{toggleDegrees('imperial')}}
                    ><Text>F</Text></TouchableOpacity>
                </View>
            </View>
        );
    }


    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Options</Text>
            <View>
                {renderDegreeToggle()}
                <TouchableOpacity 
                onPress={()=>{confirmChange(clearData, "clear")}}
                style={styles.btn}>
                    <Text style={styles.btnText}>Clear Data</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                onPress={()=>{confirmChange(addTestData, "add")}}
                style={styles.btn}>
                    <Text style={styles.btnText}>Add Test Data</Text>
                </TouchableOpacity>
            </View>
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