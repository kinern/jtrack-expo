import React, {useContext, useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {Text} from 'react-native-elements';
import {Context as ExerciseContext} from '../context/exerciseContext';


const OptionsScreen = () =>{

    const { 
        state, 
        clearDatabase, 
        insertTestData,
        fetchCalendarExercises,
        fetchGraphExercises
    } = useContext(ExerciseContext);
    const [exercises, setExercises] = useState(null);

    const confirmChange = (callback, type) => {
        const title = (type=="clear")? "Clearing Data" : "Adding Test Data";
        const message = (type=="clear")? "This will clear the database. Continue?": "This will alter current data. Continue?";
        Alert.alert(
            title,
            message,
            [
                {
                text: "Cancel",
                style: "cancel"
                },
                { text: "OK", onPress: () => {callback()} }
            ]
        );
    }

    const clearData = async () => {
        try{
            const result = await clearDatabase();
            Alert.alert("Database has been cleared.");
            reloadData();
        } catch(err){
            console.log(err);
        }

    }

    const addTestData = async () => {
        try{
            const result = await insertTestData();
            Alert.alert("Test data has been added.");
            reloadData();
        } catch (err) {
            console.log(err);
        }
    }

    const reloadData = async () => {
        try {
            await fetchGraphExercises(state.selectedDate);
            await fetchCalendarExercises(state.selectedDate);
        } catch (err){
            console.log(err);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Options</Text>
            <TouchableOpacity 
            onPress={()=>{confirmChange(clearData, "clear")}}
            style={styles.btn}>
                <Text style={styles.btnText}>Clear Data</Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>{confirmChange(addTestData, "add")}}
            style={styles.btn}>
                <Text style={styles.btnText}>Add Test Data</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: 'gray'
    },
    degreeBtnC: {
        padding: 10,
        marginTop: 5,
        width: 50,
        alignItems: 'center',
        backgroundColor: 'lightblue',
        elevation: 2
    },
    degreeBtnF:{
        padding: 10,
        marginTop: 5,
        width: 50,
        alignItems: 'center',
        backgroundColor: 'coral',
        elevation: 2
    },
    btn: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 20,
        width: 180,
        color: 'gray',
        elevation: 2
    },
    btnText: {
        fontSize: 20
    },
    degreeMenu: {
        margin: 20, 
        borderWidth: 1, 
        borderRadius: 2,
        borderColor: 'lightgray',
        alignItems: 'center',
        padding: 20
    }
});

export default OptionsScreen;