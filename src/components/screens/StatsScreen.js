import React, {useState, useContext, useEffect} from 'react';
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

    const {state, fetchGraphExercises, fetchMonthlyTotals} = useContext(ExerciseContext);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const dateStr = `${monthNames[selectedDate.getMonth()]} / ${selectedDate.getFullYear()}`;
    const [shownGraph, setShownGraph] = useState('oneMonth'); //oneMonth //sixMonths

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
                <Icon name={path} size={30} color={colors.dark} />
            </TouchableOpacity>
        );
    }

    const renderGraphScroll = () => {
        return (
            <View style={styles.swipeTextView}>
                <Icon name="angle-double-left" size={12} color={colors.inactiveLight} />
                <Text style={styles.swipeText}>Swipe To Scroll Graph</Text>
                <Icon name="angle-double-right" size={12} color={colors.inactiveLight} />
            </View>
        );
    }

    const renderAverageTime = () => {
        return (
            <View style={styles.averageMenu}>
                <Text style={styles.averageText}>This Month's Average: </Text>
                <Text style={styles.averageTime}>10min</Text>
            </View>
        );
    }

    const renderRangeMenu = () => {
        const oneColor = (shownGraph == "oneMonth")? "white" : "lightgray";
        const sixColor = (shownGraph == "sixMonths")? "white" : "lightgray";
        return (
            <View style={styles.rangeSelectMenu}>
                <TouchableOpacity 
                style={[styles.rangeBtn, {backgroundColor: oneColor}]}
                onPress={()=>{setShownGraph("oneMonth")}}
                >
                    <Text style={styles.rangeBtnText}>Monthly</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.rangeBtn, {backgroundColor: sixColor}]}
                onPress={()=>{setShownGraph("sixMonths")}}
                >
                    <Text style={styles.rangeBtnText}>Six Months</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const renderGraph = () => {
        if (shownGraph === "oneMonth"){
            return (
                <View style={styles.graphContainer}>
                    <View style={styles.dateMenu}>
                        {renderArrowButton('left')}
                        <Text style={styles.dateText}>{dateStr}</Text>
                        {renderArrowButton('right')}
                    </View>
                    <LineGraph data={state.graphExercises} />
                    {renderGraphScroll()}
                    {renderAverageTime()}
                </View>
            )
        } else {
            return (
                <View style={styles.graphContainer}>
                    <Text style={styles.sixMonthTitle}>Past Six Months</Text>
                    <SixMonthGraph data={state.monthlyTotals}/>
                </View>
            )
        }
    }

    return (
        <View style={styles.container}>
            {renderRangeMenu()}
            {renderGraph()}
        </View>
    );
}


const styles = StyleSheet.create({
    container:{
        height: '100%',
        justifyContent: 'flex-start'
    },
    rangeSelectMenu: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        marginTop: 10
    },
    rangeBtn: {
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        paddingHorizontal: 50,
        paddingVertical: 10
    },
    rangeBtnText: {
        fontSize: 14,
        fontFamily: "Roboto_700Bold",
        color: colors.dark
    },
    swipeTextView: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20
    },
    swipeText: {
        fontSize: 12,
        fontWeight: '700',
        color: colors.inactiveLight,
        marginHorizontal: 10,
    },
    arrowbtn: {
        paddingHorizontal: 20
    },
    dateText: {
        alignSelf:'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "700",
        marginHorizontal: 10,
        color: colors.medium,
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
    graphContainer: {
        backgroundColor: "white",
        justifyContent: "flex-start",
        flex: 1
    },
    sixMonthTitle: {
        width: '100%',
        textAlign: 'center',
        alignSelf: 'center',
        paddingTop: 20,
        fontSize: 20,
        fontWeight: "700",
        color: colors.medium,
    }
});


export default StatsScreen;