import React, {useState, useContext, useEffect} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import LineGraph from '../components/LineGraph';
import {Context as ExerciseContext} from '../context/exerciseContext';
import Icon from 'react-native-vector-icons/FontAwesome';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const StatsScreen = () =>{

    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateStr = `${monthNames[selectedDate.getMonth()]} / ${selectedDate.getFullYear()}`;
    const {state, fetchGraphExercises} = useContext(ExerciseContext);

    const changeMonth = (amount) => { 
        let newDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + amount));
        setSelectedDate(newDate);
        fetchGraphExercises(newDate);
    }

    const isTodayAfterSelected = () => {
        const today = new Date();
        const selectedMonth = ('0' + (selectedDate.getMonth()+1)).slice(-2);
        const selectedComp = selectedDate.getFullYear().toString() + selectedMonth.toString();
        const todayMonth = ('0' + (today.getMonth()+1)).slice(-2);
        const todayComp = today.getFullYear().toString() + todayMonth;
        return (selectedComp >= todayComp);
    }

    const renderArrowButton = (direction) => {
        const path = (direction === 'left')? "angle-double-left" : "angle-double-right";
        const monthDiff = (direction === 'left')? -1 : 1;

        if ((direction === 'right') && isTodayAfterSelected()){
            return (
                <View style={{paddingLeft: 20, paddingRight: 20}} >
                    <Icon name={path} size={30} color="lightgray" />
                </View>
            );
        }

        return (
            <TouchableOpacity
            style={styles.arrowbtn}
            onPress={()=>changeMonth(monthDiff)}
            >
                <Icon name={path} size={30} color="gray" />
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Stats</Text>
            <View style={styles.dateMenu}>
                {renderArrowButton('left')}
                <Text style={styles.dateText}>{dateStr}</Text>
                {renderArrowButton('right')}
            </View>
            <LineGraph data={state.graphExercises} />
            <View style={styles.swipeTextView}>
                <Icon name="angle-double-left" size={24} color="gray" />
                <Text style={styles.swipeText}>Swipe To Scroll Graph</Text>
                <Icon name="angle-double-right" size={24} color="gray" />
            </View>
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
    swipeTextView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    swipeText: {
        fontSize: 16,
        fontWeight: '700',
        color: 'gray',
        marginRight:10,
        marginLeft: 10
    },
    arrowbtn: {
        paddingRight: 20, 
        paddingLeft: 20
    },
    dateText: {
        alignSelf:'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "700",
        marginLeft: 10,
        marginRight: 10,
        color: 'rgb(47, 72, 88)'
    },
    dateMenu: {
        borderColor: 'lightgray',
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    }
});


export default StatsScreen;