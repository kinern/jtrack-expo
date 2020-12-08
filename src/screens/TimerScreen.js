import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Input, Text} from 'react-native-elements';

import Header from '../components/Header';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import colors from '../theme/colors';

const TimerScreen = ({navigation}) => {

    const [timerOn, setTimerOn] = useState(false);
    const [time, setTime] = useState('01:00');
    let iconName = (timerOn)? 'play': 'stop'; 

    const toggleTimer = () => {
        setTimerOn(!timerOn);
    };

    const resetTimer = () => {
        setTime('00:00');
        setTimerOn(false);
    }

    return (
        <View style={styles.container}>
            <Header title={navigation.state.routeName}/>
            <View style={styles.timerTitle}>
                <Text h3>Timer</Text>
                <Icon name='timer' size={30} />
            </View>
            <View style={styles.currentTimeMenu}>
                <Text style={styles.currentTimeText}>Today's Recorded Time:</Text>
                <Text style={styles.currentTime}>10min</Text>
            </View>
            <View style={styles.timerMenu}>
                <Input value={time} 
                containerStyle={styles.timerInput}
                inputStyle={styles.timerInputText}
                />
                <TouchableOpacity 
                onPress={toggleTimer}
                >
                    <Icon name={iconName} size={30} />
                </TouchableOpacity>
                <TouchableOpacity
                onPress={resetTimer}
                >
                    <Icon name='restart' size={30} />
                </TouchableOpacity>
            </View>
            <View >
                <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>Add To Workout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        justifyContent:'flex-start',
        alignItems: 'center'
    },
    currentTimeMenu : {
        flexDirection: 'row'
    },
    currentTimeText: {
        fontSize: 20
    },
    currentTime: {
        fontSize: 20
    },
    timerTitle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center',
        padding: 20
    },
    timerMenu: {
        flexDirection: 'row',
        paddingTop: 50
    },
    timerInput: {
        width: 120,
    },
    timerInputText: {
        fontWeight: '700',
        textAlign: 'center'
    },
    addBtn: {
        borderColor: colors.inactiveLight,
        borderWidth: 1,
        borderRadius: 2,
        padding: 20,
        elevation: 2
    },
    addBtnText: {
        fontSize: 16,
        fontWeight: '700'
    }
});

export default TimerScreen;