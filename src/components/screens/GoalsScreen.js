import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text, Input} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from '../components/Header';
import colors from '../theme/colors';

const GoalsScreen = ({navigation}) => {

    const weekdayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const weekdayShort = ['s', 'm', 't', 'w', 't', 'f', 's'];
    const goalDaysObj  = {};
    weekdayNames.map((item)=>{
        goalDaysObj[item] = 0;
    }); 
    const {state, saveGoal} = useContext(ExerciseContext);
    const [goalDays, setGoalDays] = useState(state.goal.weekdays);
    const [exerciseTime, setExerciseTime] = useState(state.goal.minutes);

    const renderWeekdayButtons = () => {
        const buttons = weekdayNames.map((item)=>{
            const bgColor = ((goalDays[item]) && goalDays[item] !== 0)? colors.highlight : colors.medium;
            let index = weekdayNames.indexOf(item);
            return (
                <TouchableOpacity 
                key={item} 
                style={[styles.weekdayBtn, {backgroundColor: bgColor}]}
                onPress={()=>{updateWeekday(item)}}
                >
                    <Text style={styles.weekdayBtnText}>{weekdayShort[index].toUpperCase()}</Text>
                </TouchableOpacity>
                );            
            }
        );
        return (
            <View style={styles.inlineMenu}>
                <View style={styles.weekdayBtnMenu}>
                    {buttons}
                </View>
            </View>
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
            <Text style={styles.title}>WEEKDAYS</Text>
            {renderWeekdayButtons()}
            <Text style={styles.title}>TIME</Text>
            <View style={styles.inlineMenu}>
                <View style={styles.inputMenu}>
                    <View style={styles.inlineTitle}>
                        <Icon name={"timer"} color={colors.dark} size={24} />
                        <Text style={[styles.minutesText, {marginLeft: 5}]}>Set Minutes</Text>
                    </View>
                    <Input 
                    value={exerciseTime.toString()}
                    onChangeText={(text)=>{setExerciseTime(text.toString())}} 
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={{borderBottomColor: "white"}}
                    inputStyle={styles.inputText}
                    />
                </View>
            </View>
            <TouchableOpacity
            style={styles.saveBtn}
            onPress={()=>{saveGoalData()}}
            >
                <Text style={styles.saveBtnText}>SAVE</Text>
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.light
    },
    title: {
        padding: 20,
        alignSelf: "flex-start",
        fontSize: 12,
        fontFamily: "Roboto_700Bold",
        color: colors.medium
    }, 
    minutesText: {
        fontSize: 14,
        color: colors.dark,
        fontFamily: "Roboto_700Bold"
    },
    inlineMenu: {
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: "space-between",
        backgroundColor: "white",
        borderRadius: 10
    },
    inputMenu: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'stretch',
        justifyContent: "space-between",
        margin: 20,
    },
    inlineTitle: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    inputContainer: {
        width: 200,
        padding: 0,
        margin: 0,
        marginBottom: -15,
        borderBottomWidth:0
    },
    inputText: {
        color: colors.medium,
        textAlign: 'center',
        padding:0,
        fontSize: 24,
        fontFamily: "Roboto_700Bold"
    },
    weekdayBtnMenu: {
        backgroundColor: colors.medium,
        marginVertical: 20,
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 40,
        flexDirection: 'row',
        justifyContent:'space-evenly',
        elevation: 2
    },
    weekdayBtn: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: "center",
        elevation: 2,
    },
    weekdayBtnText: {
        fontSize: 20,
        fontFamily: 'Roboto_700Bold',
        color: colors.dark
    }, 
    saveBtn: {
        backgroundColor: colors.highlight,
        borderRadius: 25,
        marginHorizontal: 30,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginVertical: 20,
        shadowColor: colors.medium,
        shadowRadius: 2,
        alignSelf: "flex-end"
    },
    saveBtnText: {
        fontSize: 14,
        color: colors.medium,
        fontFamily: "Roboto_700Bold"
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center"
    }
});

export default GoalsScreen;