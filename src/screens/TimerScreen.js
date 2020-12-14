import React, {useState, useEffect, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Header from '../components/Header';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';


const TimerScreen = ({navigation}) => {

    const {state, saveExercise, fetchTodayExercise} = useContext(ExerciseContext);
    const [timerOn, setTimerOn] = useState(false);
    const [currentTime, setCurrentTime] = useState(state.todayExercise.time);
    const [sec, setSec] = useState(0);
    const [min, setMin] = useState(0);
    let iconName = (timerOn)? 'stop': 'play'; 


    //Called when component loads.
    useEffect(()=>{
        fetchTodayExercise();
    }, []);


    //Called multiple times because of timer.
    useEffect(()=>{
        let interval = null;
        if (timerOn){
            interval = setInterval(()=>{
                if (sec == 59){
                    setSec(0)
                    const newMin = min + 1;
                    setMin(newMin);
                } else {
                    const newSec = sec + 1;
                    setSec(newSec);
                }
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return ()=>{clearInterval(interval)};
    }, [timerOn, sec, min])

    const toggleTimer = () => {
        setTimerOn(!timerOn);
    };

    const resetTimer = () => {
        setSec(0);
        setMin(0);
        setTimerOn(false);
    }

    //Get recoded time from sec and min, and current exercise time, 
    //then save sum to database.
    const addToCurrentTime = async () => {
        const addTime = (sec > 30)? min+1: min;
        const date = new Date();
        saveExercise(date, addTime + currentTime, ()=>{fetchTodayExercise()});
        setCurrentTime(state.todayExercise.time);
        setMin(0);
        setSec(0);
        
    };

    const renderButton = (onPressFn, iconStr) => {
        return (
            <TouchableOpacity 
            onPress={onPressFn}
            >
                <Icon name={iconStr} color={colors.medium} size={40} />
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Header title={navigation.state.routeName}/>
            <View style={styles.timerContainer}>
                <Text style={styles.timer}>{('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2)} </Text>
                <View style={styles.timerMenu}>
                    {renderButton(toggleTimer, iconName)}
                    {renderButton(resetTimer, 'restart')}
                </View>
            </View>
            <View >
                <TouchableOpacity 
                style={styles.addBtn}
                onPress={addToCurrentTime}
                >
                    <Text style={styles.addBtnText}>Add To Workout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.currentTimeMenu}>
                <Text style={styles.currentTimeText}>Today's Recorded Time:</Text>
                <Text style={styles.currentTimeText}>{currentTime}min</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent:'flex-start',
        alignItems: 'center',
        backgroundColor: colors.light
    },
    timerContainer: {
        paddingVertical: 50,
        width: '100%'
    },
    timerTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        padding: 20
    },
    timerMenu: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    timer: {
        width: '100%',
        textAlign: 'right',
        fontSize: 120,
        color: colors.highlight,
        textShadowColor: colors.medium,
        textShadowRadius: 20
    },
    addBtn: {
        borderColor: colors.inactiveLight,
        borderWidth: 1,
        borderRadius: 40,
        backgroundColor: 'white',
        padding: 15,
        marginVertical: 20,
        elevation: 2
    },
    addBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.medium
    },
    currentTimeMenu : {
        flexDirection: 'row'
    },
    currentTimeText: {
        fontSize: 20,
        color: colors.highlight,
        padding: 5,
        textShadowColor: colors.medium,
        textShadowRadius: 10
    },
});

export default TimerScreen;