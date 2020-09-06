import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import {Context as ExerciseContext} from '../context/exerciseContext';

const LineGraph = () => {

    const {state, fetchExercises} = useContext(ExerciseContext);

    const stateData = state.exercises;

    const data = [
        {time: 50, date: new Date(2014, 8, 1, 0, 0)}, 
        {time: 10, date: new Date(2014, 8, 2, 0, 0)}, 
        {time: 40, date: new Date(2014, 8, 3, 0, 0)}, 
        {time: 20, date: new Date(2014, 8, 4, 0, 0)}, 
        {time: 40, date: new Date(2014, 8, 5, 0, 0)}, 
        {time: 70, date: new Date(2014, 8, 6, 0, 0)}, 
        {time: 15, date: new Date(2014, 8, 7, 0, 0)}, 

    ]

    const contentInset = { top: 20, bottom: 20, left: 5, right: 20 }

    return (
        <View style={{padding: 30}}>
            <View style={{ height: 200, flexDirection: 'row' }}>
                <YAxis
                    data={data.map(item=>item.time)}
                    contentInset={contentInset}
                    svg={{fill: 'grey', fontSize: 10}}
                    numberOfTicks={10}
                    formatLabel={(value) => `${value}`}
                />
                <LineChart
                    style={{ flex: 1 }}
                    data={ data }
                    yAccessor={ ({ item }) => item.time }
                    xAccessor={ ({ item }) => item.date }
                    xScale={ scale.scaleTime }
                    svg={{ stroke: 'rgb(134, 65, 244)' }}
                    contentInset={contentInset}
                >
                    <Grid />
                </LineChart>
            </View>
        <XAxis
            data={data}
            xAccessor={ ({ item }) => item.date }
            scale={ scale.scaleTime }
            formatLabel={(date)=>{return date.getDate()}}
            contentInset={{right: 20, left: 20}}
            svg={{ fontSize: 10, fill: 'black' }}
        />
        </View>
    )
}
const styles = StyleSheet.create({});

export default LineGraph;