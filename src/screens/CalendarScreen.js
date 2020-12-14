import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
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
        fetchTodayExercise,
        fetchMonthlyTotals,
        fetchGoal
    } = useContext(ExerciseContext);
    const startMonth = new Date();
    const [goalMinutes, setGoalMinutes] = useState(0);


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
        }).then((res)=>{
            return fetchGraphExercises(startMonth);
        }).then(()=>{
            return fetchTodayExercise();
        }).then(()=>{
            const date = new Date();
            return fetchMonthlyTotals(date);
        }).then(()=>{
            console.log('monthly totals:', state.monthlyTotals);
            return fetchGoal();
        }).then(()=>{
            setGoalMinutes(state.goal.minutes);
        }).catch((err)=>{
            console.log('err:', err);
        }); 
    }


    const renderGoalMinutes = () => {
        if ((!state.goal.weekdays) || (state.goal.minutes == 0)){
            return null;
        }
        const {minutes, weekdays} = state.goal; 
        const weekdayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
        const date = new Date();
        const dateStr = weekdayMap[date.getDay()];
        return (weekdays[dateStr] != "0")? <Text>/{minutes}</Text> : null;
    }
    

    return (
        <View>
            <Header title={navigation.state.routeName}/>
            <View style={styles.todayExercise}>
                <Text style={styles.exerciseTimeText}>Today's Time:</Text>
                <Text style={styles.exerciseTime}>
                    {state.todayExercise.time}
                    {renderGoalMinutes()}
                    min
                </Text>
            </View>
            <Calendar navigation={navigation}/>
        </View>
    );
}


const styles = StyleSheet.create({
    todayExercise: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        backgroundColor: colors.light
    },
    exerciseTimeText: {
        fontSize: 20,
        color: colors.highlight,
        textShadowColor: colors.medium,
        textShadowRadius: 20
    },
    exerciseTime: {
        fontSize: 28,
        marginLeft: 10,
        color: colors.highlight,
        textShadowColor: colors.medium,
        textShadowRadius: 20
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