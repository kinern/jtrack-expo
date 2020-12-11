import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, Input} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';

import Header from '../components/Header';
import colors from '../theme/colors';

const GoalsScreen = ({navigation}) => {

    const weekdayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const goalDaysObj  = {};
    weekdayNames.map((item)=>{
        goalDaysObj[item] = 0;
    }); 
    const {state, saveGoal} = useContext(ExerciseContext);
    const [goalDays, setGoalDays] = useState(state.goal.weekdays);
    const [exerciseTime, setExerciseTime] = useState(state.goal.minutes);

    const renderWeekdayButtons = () => {
        const buttons = weekdayNames.map((item)=>{
            const bgColor = ((goalDays[item]) && goalDays[item] !== 0)? colors.medium : colors.inactiveLight;
            return (
                <TouchableOpacity 
                key={item} 
                style={{...styles.weekdayBtn, backgroundColor: bgColor}}
                onPress={()=>{updateWeekday(item)}}
                >
                    <Text>{item}</Text>
                </TouchableOpacity>
                );            
            }
        );
        return (
            <View style={styles.weekdayBtnMenu}>{buttons}</View>
        );
    }

    const updateWeekday = (weekday) => {
        let newGoalDays = goalDays;
        newGoalDays[weekday] = (newGoalDays[weekday] !== 0)? 0 : 1;
        setGoalDays({...newGoalDays});
    }

    const saveGoalData = () => {
        saveGoal(goalDays, exerciseTime);
    }

    return (
        <View style={styles.container}>
            <Header title={navigation.state.routeName}/>
            <View style={styles.inlineMenu}>
                <Text style={styles.mainText}>I want to exercise on:</Text>
            </View>
            {renderWeekdayButtons()}
            <View style={styles.inlineMenu}>
                <Text style={styles.mainText}>I want to do</Text>
                <Input 
                value={exerciseTime.toString()}
                onChangeText={(text)=>{setExerciseTime(text.toString())}} 
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                />
                <Text style={styles.mainText}>Minutes per workout</Text>
            </View>
            <TouchableOpacity
            style={styles.saveBtn}
            onPress={()=>{saveGoalData()}}
            >
                <Text style={styles.saveBtnText}>Save Goal</Text>
            </TouchableOpacity>
            <Text style={styles.goalMessage}>You Can Do It!</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        alignItems: 'center'
    },
    mainText: {
        fontSize: 16
    },
    inlineMenu: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    inputContainer: {
        width: 80,
        padding: 0,
        margin: 0,
        marginBottom: -15
    },
    inputText: {
        textAlign: 'center',
        margin: 0,
        padding:0,
        fontSize: 30
    },
    weekdayBtnMenu: {
        flexDirection: 'row',
        justifyContent:'space-evenly',
        width: '100%'
    },
    weekdayBtn: {
        borderWidth: 1,
        borderColor: 'lightgray',
        padding: 10
    },
    saveBtn: {
        borderColor: 'lightgray',
        borderWidth: 1,
        padding: 10,
        elevation: 2
    },
    saveBtnText: {
        fontSize: 18,
        fontWeight: '700'
    },
    goalMessage: {
        backgroundColor: 'lightgray',
        borderRadius: 100,
        fontSize: 36,
        marginTop: 50,
        padding: 25
    }
});

export default GoalsScreen;