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
    const [hour, setHour] = useState(0);
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
                if (min == 59){
                    setMin(0);
                    const newHour = hour + 1;
                    setHour(newHour);
                }
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
            style={styles.iconBtn}
            >
                <Icon name={iconStr} color={colors.medium} size={40} />
            </TouchableOpacity>
        );
    };


    const renderTimerParts = () => {
        return (
            <View style={styles.timerParts}>
                <Text style={styles.timerText}>{('0' + hour).slice(-2)}</Text>
                <Text style={styles.timerText}>:</Text>
                <Text style={styles.timerText}>{('0' + min).slice(-2)}</Text>
                <Text style={styles.timerText}>:</Text>
                <Text style={styles.timerText}>{('0' + sec).slice(-2)}</Text>
            </View>
        );
    }

    
    return (
        <View style={styles.container}>
            <View style={styles.timerScreen}>
                <View style={styles.timerContainer}>
                    {renderTimerParts()}
                    <View style={styles.timerMenu}>
                        {renderButton(toggleTimer, iconName)}
                        {renderButton(resetTimer, 'restart')}
                        {renderButton(addToCurrentTime, 'plus')}
                    </View>
                </View>
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
    timerScreen: {
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
    },
    timerContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 50,
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
        alignItems: 'center',
        marginTop: 50
    },
    timerParts: {
        flexDirection: 'row',
        justifyContent:'center'
    },
    timerText: {
        fontSize: 56,
        fontFamily: 'Lato_400Regular',
        color: colors.medium,
        marginHorizontal: 5
    },
    iconBtn: {
        backgroundColor: "white",
        shadowColor: colors.medium,
        shadowRadius: 3,
        borderRadius: 40,
        padding: 10,
        marginHorizontal: 20,
        elevation: 2

    },
    currentTimeMenu : {
        flexDirection: 'row'
    },
    currentTimeText: {
        fontSize: 18,
        color: colors.medium,
        padding: 5,
    },
});

export default TimerScreen;