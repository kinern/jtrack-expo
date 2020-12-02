import React from 'react';
import {StyleSheet} from 'react-native';
import ExerciseForm from '../components/ExerciseForm';


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
        <ExerciseForm date={date} callback={callback}/>
    );
};

const styles = StyleSheet.create({});

export default AddExerciseScreen;