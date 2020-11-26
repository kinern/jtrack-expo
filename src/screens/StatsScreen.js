import React, {useState, useEffect, useContext} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import LineGraph from '../components/LineGraph';
import {Context as ExerciseContext} from '../context/exerciseContext';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const StatsScreen = () =>{

    const startDate = new Date();
    const [navDate, setNavDate] = useState(new Date());
    const [dateStr, setDateStr] = useState(`${monthNames[startDate.getMonth()]} / ${startDate.getFullYear()}`);
    
    /*
    const {state, fetchExercises} = useContext(ExerciseContext);
    useEffect(()=>{
        fetchExercises();
    }, []);
    */
    
    const changeMonth = (amount) => {
        setNavDate(new Date(navDate.setMonth(navDate.getMonth()+amount)));
        setDateStr(`${monthNames[navDate.getMonth()]} / ${navDate.getFullYear()}`);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stats</Text>
            <View style={styles.dateMenu}>
                <TouchableOpacity
                onPress={()=>changeMonth(-1)}
                >
                    <Text>Prev</Text>
                </TouchableOpacity>
                <Text style={styles.dateText}>{dateStr}</Text>
                <TouchableOpacity
                onPress={()=>changeMonth(1)}
                >
                    <Text>Next</Text>
                </TouchableOpacity>
            </View>
            <LineGraph style={styles.graph} navDate={navDate} />
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        marginTop:30
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: 'gray',
        alignSelf: 'center'
    },
    dateText: {
        alignSelf:'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 10,
        marginRight: 10
    },
    dateMenu: {
        borderColor: 'lightgray',
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
});


export default StatsScreen;