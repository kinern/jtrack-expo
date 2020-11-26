import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import {Context as ExerciseContext} from '../context/exerciseContext';
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

const LineGraph = ({data}) => {


    const contentInset = { top: 20, bottom: 20, left: 5, right: 20 }

    const renderGraph = () => {
        console.log('data before graph:',data);
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
        );
    }


    return (
        <React.Fragment>
            {renderGraph()}
        </React.Fragment>
    );
}
const styles = StyleSheet.create({});

export default LineGraph;