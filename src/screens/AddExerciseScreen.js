import React from 'react';
import {StyleSheet} from 'react-native';
import ExerciseForm from '../components/ExerciseForm';

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