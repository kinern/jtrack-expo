import React, {useState, useEffect} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Input, Text} from 'react-native-elements';

import Header from '../components/Header';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../theme/colors';

const TimerScreen = ({navigation}) => {

    const [timerOn, setTimerOn] = useState(false);
    const [timerInterval, setTimerInterval] = useState('');
    const [sec, setSec] = useState(0);
    const [min, setMin] = useState(0);
    let iconName = (timerOn)? 'stop': 'play'; 


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
        if (timerOn){
            clearInterval(timerInterval);
        }
        setSec(0);
        setMin(0);
        setTimerOn(false);
    }

    return (
        <View style={styles.container}>
            <Header title={navigation.state.routeName}/>
            <View style={styles.timerContainer}>
                <Text style={styles.timer}>{('0' + min).slice(-2) + ':' + ('0' + sec).slice(-2)} </Text>
                <View style={styles.timerMenu}>
                    <TouchableOpacity 
                    onPress={toggleTimer}
                    >
                        <Icon name={iconName} color={colors.medium} size={40} />
                    </TouchableOpacity>
                    <TouchableOpacity
                    onPress={resetTimer}
                    >
                        <Icon name='restart' color={colors.medium} size={40} />
                    </TouchableOpacity>
                </View>
            </View>
            <View >
                <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>Add To Workout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.currentTimeMenu}>
                <Text style={styles.currentTimeText}>Today's Recorded Time:</Text>
                <Text style={styles.currentTimeText}>10min</Text>
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