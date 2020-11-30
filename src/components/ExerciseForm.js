import React, {useContext, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Context as ExerciseContext} from '../context/exerciseContext';
import {Text, Input, Button} from 'react-native-elements';


const ExerciseForm = ({date, callback}) => {

    const {saveExercise} = useContext(ExerciseContext);
    const [newMinutes, setMinutes] = useState(date.minutes);

    const submitForm = () => {
        saveExercise(date.date, newMinutes, callback);
    }

    return (
        <View style={styles.container}>
            <Text h3>{date.date}</Text>
            <Text>How many minutes did you exercise today?</Text>
            <Input value={newMinutes} onChangeText={setMinutes}/>
            <Button title="Submit" onPress={()=>{submitForm()}} />
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