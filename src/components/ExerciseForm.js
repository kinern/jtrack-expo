import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Context as ExerciseContext} from '../context/exerciseContext';
import {Text, Input, Button} from 'react-native-elements';


const ExerciseForm = ({date, callback}) =>{
    //Navigator getParams('date') to get clicked on date
    const {fetchExercise, saveExercise} = useContext(ExerciseContext);
    const [minutes, setMinutes] = useState('0');

    //Get the saved number of minutes if it exists
    useEffect(function(){
        const result = fetchExercise();
        if (result){
            setMinutes(result.minutes);
        }
    },[]);

    return (
        <View style={styles.container}>
            <Text h3>{date}</Text>
            <Text>How many minutes did you exercise today?</Text>
            <Input value={minutes} onChangeText={setMinutes}/>
            <Button title="Submit" onPress={()=>{saveExercise(date, minutes, callback)}} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default ExerciseForm;