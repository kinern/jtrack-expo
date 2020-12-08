import React, {useState, useContext} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';

import Header from '../components/Header';
import LineGraph from '../components/LineGraph';
import SixMonthGraph from '../components/SixMonthGraph';

import {Context as ExerciseContext} from '../context/exerciseContext';
import colors from '../theme/colors';

import Icon from 'react-native-vector-icons/FontAwesome';


const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


/*
StatsScreen Component

Displays a LineGraph Component and buttons to change the month being shown.
*/
const StatsScreen = ({navigation}) =>{

    const {state, fetchGraphExercises} = useContext(ExerciseContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateStr = `${monthNames[selectedDate.getMonth()]} / ${selectedDate.getFullYear()}`;

    //Calls the context fetchGraphExercises function to get new data for the graph.
    const changeMonth = (amount) => { 
        let newDate = new Date(selectedDate.setMonth(selectedDate.getMonth() + amount));
        setSelectedDate(newDate);
        fetchGraphExercises(newDate);
    }

    //Prevents user from accessing months in the future.
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
                    <Icon name={path} size={30} color={colors.inactiveLight} />
                </View>
            );
        }

        return (
            <TouchableOpacity
            style={styles.arrowbtn}
            onPress={()=>changeMonth(monthDiff)}
            >
                <Icon name={path} size={30} color={colors.medium} />
            </TouchableOpacity>
        );
    }

    return (
        <View style={styles.container}>
            <Header title={navigation.state.routeName}/>
            <View>
                <View style={styles.dateMenu}>
                    {renderArrowButton('left')}
                    <Text style={styles.dateText}>{dateStr}</Text>
                    {renderArrowButton('right')}
                </View>
                <LineGraph data={state.graphExercises} />
                <View style={styles.swipeTextView}>
                    <Icon name="angle-double-left" size={12} color={colors.inactiveLight} />
                    <Text style={styles.swipeText}>Swipe To Scroll Graph</Text>
                    <Icon name="angle-double-right" size={12} color={colors.inactiveLight} />
                </View>
                <View style={styles.averageMenu}>
                    <Text style={styles.averageText}>This Month's Average: </Text>
                    <Text style={styles.averageTime}>10min</Text>
                </View>
            </View>
            <View style={styles.sixMonthContainer}>
                <Text style={styles.sixMonthTitle}>Past Six Months</Text>
                <SixMonthGraph />
            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        height: '100%',
        justifyContent: 'flex-start'
    },
    swipeTextView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    swipeText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.inactiveLight,
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
        color: colors.medium
    },
    dateMenu: {
        borderColor: colors.light,
        borderWidth: 1,
        padding: 10,
        marginTop: 10,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    averageMenu: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    averageText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.medium
    },
    averageTime: {
        fontSize: 20,
        color: colors.light
    },
    sixMonthContainer: {
        backgroundColor: colors.inactiveLight,
        width: '100%',
        paddingBottom: 30
    },
    sixMonthTitle: {
        width: '100%',
        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: 10,
        fontSize: 18,
        fontWeight: "700",
        color: colors.highlight
    }
});


export default StatsScreen;