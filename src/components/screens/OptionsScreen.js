import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Text} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';
import {Context as WeatherContext} from '../context/weatherContext';

import Header from '../components/Header';

import colors from '../theme/colors';

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

        const degreeCBg = (weatherState.degrees == 'metric')? colors.highlight: colors.lightGray
        const degreeFBg = (weatherState.degrees == 'imperial')? colors.highlight: colors.lightGray;

        return (
            <View style={styles.row}>
                <Text style={styles.title}>Degrees</Text>
                <View style={styles.toggle}>
                    <TouchableOpacity 
                    style={[styles.toggleBtnLeft, {backgroundColor: degreeCBg}]}
                    onPress={()=>{toggleDegrees('metric')}}
                    ><Text style={styles.toggleBtnText}>C</Text></TouchableOpacity>
                    <TouchableOpacity 
                    style={[styles.toggleBtnRight, {backgroundColor: degreeFBg}]}
                    onPress={()=>{toggleDegrees('imperial')}}
                    ><Text style={styles.toggleBtnText}>F</Text></TouchableOpacity>
                </View>
            </View>
        );
    }


    const renderOptionButton = (onPressFunction, Title, buttonTitle) => {
        return (
            <View style={styles.row}>
                <Text style={styles.title}>{Title}</Text>
                <TouchableOpacity 
                onPress={onPressFunction}
                style={styles.btn}>
                    <Text style={styles.btnTitle}>{buttonTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    } 


    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.sectionTitle}>WEATHER</Text>
                <View style={styles.section}>
                    {renderDegreeToggle()}
                </View>
                <Text style={styles.sectionTitle}>DATA</Text>
                <View style={styles.section}>
                    {renderOptionButton(()=>{confirmChange(addTestData, "add")}, 'Add Test Data', 'ADD')}
                    {renderOptionButton(()=>{confirmChange(clearData, "clear")}, 'Clear Database', 'CLEAR')}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.light,
    },
    sectionTitle: {
        padding: 20,
        fontSize: 12,
        width: '100%',
        fontWeight: "700",
        backgroundColor: colors.light,
        color: colors.medium,
        fontFamily: "Roboto_700Bold",
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colors.highlight,
        marginHorizontal: 20,
        paddingVertical: 10
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        color: colors.dark
    },
    toggle: {
        flexDirection: 'row',
    },
    toggleBtnLeft: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        borderWidth: 1,
        borderColor: colors.lightGray
    },
    toggleBtnRight: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        elevation: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        borderWidth: 1,
        borderColor: colors.lightGray
    },
    toggleBtnText: {
        fontSize: 18,
        fontWeight: '700',
        color: colors.dark
    },
    btn: {
        minWidth: 80,
        padding: 10,
        borderRadius: 10,
        elevation: 2,
        alignItems: 'center',
        backgroundColor: colors.highlight
    },
    btnTitle: {
        fontWeight: '700',
        color: colors.medium
    },
    section: {
        backgroundColor: "white",
        borderRadius: 10
    }

});


export default OptionsScreen;