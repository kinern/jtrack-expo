import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Calendar from '../components/Calendar';
import DB from '../api/database';

import Header from '../components/Header';

import colors from '../theme/colors';

const db = new DB();

/*
Calendar Screen Component

The default screen for the application. Does intial database queries to get saved
exercise data which will be be displayed on the calendar and line graph.

Displays Calendar component and "Today" button which toggles the TodayBox 
modal component.

*/
const CalendarScreen = ({navigation}) =>{

    const {
        state, 
        fetchCalendarExercises, 
        fetchGraphExercises, 
        fetchTodayExercise
    } = useContext(ExerciseContext);
    const [modalVisible, setModalVisible] = useState(false);
    const startMonth = new Date();



    //useEffect is called one time before screen renders.
    useEffect(()=>{
        fullySetupDatabase();
    }, []);


    //Sets up new database if it doesn't exist, and then retrieve data for
    //calendar and graph.
    const fullySetupDatabase = () => {
        db.setupDatabase()
        .then((res)=>{
            return fetchCalendarExercises(startMonth);
        })
        .then((res)=>{
            return fetchGraphExercises(startMonth);
        }).then(()=>{
            return fetchTodayExercise();
        })
        .catch((err)=>{console.log('err:', err)}); 
    }


    //Renders the "Today" toggle button next to the title.
    const renderModalButton = () => {
        return(
            <TouchableOpacity
            style={styles.closedContainer}
            onPress={()=>{setModalVisible(!modalVisible)}}
            >
                <Text style={styles.toggleText}>Today</Text>
            </TouchableOpacity>
        );
    }
    
    
    return (
        <View style={styles.main}>
            <Header title={navigation.state.routeName}/>
            <View style={styles.todayExercise}>
                <Text style={styles.exerciseTimeText}>Today's Time:</Text>
                <Text style={styles.exerciseTime}>{state.todayExercise.time}min</Text>
            </View>
            <View style={styles.hrBar}/>
            <Calendar navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
    },
    todayExercise: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        padding: 20
    },
    exerciseTimeText: {
        fontSize: 20
    },
    exerciseTime: {
        fontSize: 28,
        color: colors.light,
        marginLeft: 10
    },
    hrBar: {
        borderBottomColor: colors.light,
        borderBottomWidth: 1,
    },
    top: {
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%',
        alignSelf: 'flex-end'
    }, 
    closedContainer: {
        borderWidth:3,
        borderColor: '#876f94',
        width: 50,
        height: 25,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#b491c7',
        elevation: 5,
    },
    title: { 
        fontSize: 24,
        fontWeight: '700',
        color: 'gray',
        alignSelf: 'center'
    }
});

export default CalendarScreen;