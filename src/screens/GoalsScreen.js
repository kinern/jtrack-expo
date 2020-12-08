import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, Input} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';

import Header from '../components/Header';
import colors from '../theme/colors';

const GoalsScreen = ({navigation}) => {

    const weekdayNames = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
    const goalDaysObj  = {};
    weekdayNames.map((item)=>{
        goalDaysObj[item] = colors.inactiveLight;
    }); 
    const [goalDays, setGoalDays] = useState(goalDaysObj);
    const {state, updateGoalDays} = useContext(ExerciseContext);
    const [exerciseTime, setExerciseTime] = useState('0');


    const renderWeekdayButtons = () => {
        const buttons = weekdayNames.map((item)=>{
            return (
                <TouchableOpacity 
                key={item} 
                style={{...styles.weekdayBtn, backgroundColor: goalDays[item]}}
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
        newGoalDays[weekday] = (newGoalDays[weekday] == colors.light)? colors.inactiveLight : colors.light;
        updateGoalDays(weekday);
        setGoalDays({...newGoalDays});
    }

    const saveGoal = () => {
        //call exercise context to save exerciseTime state variable to user goal setting.
    };

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
                value={exerciseTime}
                onChangeText={(text)=>{setExerciseTime(text.toString())}} 
                containerStyle={styles.inputContainer}
                inputStyle={styles.inputText}
                />
                <Text style={styles.mainText}>Minutes per workout</Text>
            </View>
            <TouchableOpacity
            style={styles.saveBtn}
            onPress={()=>{saveGoal()}}
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