import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Calendar from '../components/Calendar';
import DB from '../api/database';
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
        }).catch((err)=>{
            console.log('err:', err);
        }); 
    }

    useEffect(()=>{
        if (Object.prototype.hasOwnProperty.call(state, 'goal')){
            setGoalMinutes(state.goal.minutes);
        }
    }, [state]);


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
            <View style={styles.todayExercise}>
                <Text style={styles.exerciseTimeText}>Today:</Text>
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

CalendarScreen.navigationOptions = {
    title: 'calendar'
}


const styles = StyleSheet.create({
    todayExercise: {
        flexDirection: 'row',
        justifyContent:'flex-start',
        alignItems: 'center',
        padding: 20,
        width: '100%',
        backgroundColor: colors.highlight,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10
    },
    exerciseTimeText: {
        fontSize: 14,
        color: colors.medium
    },
    exerciseTime: {
        fontSize: 16,
        marginLeft: 10,
        fontWeight: "700",
        color: colors.medium
    }
});

export default CalendarScreen;