import React from 'react';
import {StyleSheet, View} from 'react-native';
import ExerciseForm from '../components/ExerciseForm';

import Header from '../components/Header';

/* 
AddExerciseScreen Component

Takes navigation and gets essential prop values for the ExerciseForm screen,
including a callback that redirects the user to the calendar after 
submitting the form.

Displays the ExerciseForm component.
*/
const AddExerciseScreen = ({navigation}) =>{
    const date = navigation.getParam('date');
    const callback = () =>{
        navigation.navigate('Calendar');
    }
    return (
        <View>
            <Header title={navigation.state.routeName}/>
            <ExerciseForm date={date} callback={callback}/>
        </View>
    );
};

const styles = StyleSheet.create({});

export default AddExerciseScreen;