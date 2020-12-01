import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import WeatherBox from '../components/WeatherBox';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Calendar from '../components/Calendar';
import DB from '../api/database';


const CalendarScreen = ({navigation}) =>{

    const {
        state, 
        fetchCalendarExercises, 
        fetchGraphExercises, 
        fetchTodayExercise
    } = useContext(ExerciseContext);
    const [modalVisible, setModalVisible] = useState(false);
    const startMonth = new Date();

    //Since Calendar is the default screen, fetch initial database data.
    useEffect(()=>{
        fullySetupDatabase();
    }, []);

    const db = new DB();

    const fullySetupDatabase = () => {
        
        db.setupDatabase()
        .then((res)=>{
            return fetchCalendarExercises(startMonth);
        })
        .then((res)=>{
            return fetchGraphExercises(startMonth);
        }).then(()=>{
            //return fetchTodayExercise();
        })
        .catch((err)=>{console.log('err:', err)});
        
    }

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
            <WeatherBox 
            modalVisible={modalVisible}
            changeModalVisible={(val)=>{setModalVisible(val)}} 
            />
            <View style={styles.top}>
                <Text style={styles.title}>JTrack</Text>
                {renderModalButton()}
            </View>
            <Calendar navigation={navigation}/>
        </View>
    );
}

const styles = StyleSheet.create({
    main: {
        marginTop: 30
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