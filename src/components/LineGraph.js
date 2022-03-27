import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import { LineChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'

import colors from '../theme/colors';


/*
LineGraph Component

Displays a monthly line graph, where the x-axis is the days of the month
and the y-axis is the minutes exercised.

*/
const LineGraph = ({data = []}) => {

    const contentInset = { top: 20, bottom: 20, left: 5, right: 20 }

    const renderYAxis = () => {
        return (
            <YAxis
            data={data.map(item=>item.time)}
            contentInset={contentInset}
            svg={{fontSize: 10, fill: colors.inactiveDark}}
            numberOfTicks={8}
            formatLabel={(value) => `${value}`}
            />
        );
    }

    const renderXAxis = () => {
        return (
            <XAxis
            data={data}
            xAccessor={ ({ item }) => item.date }
            scale={ scale.scaleTime }
            formatLabel={(date)=>{return date.getDate()}}
            contentInset={{right: 20, left: 20}}
            svg={{ fontSize: 14, fill: colors.inactiveDark }}
            style={{marginTop: -10}}
            />
        );
    }


    return (
        <ScrollView style={styles.scrollview} horizontal={true}>
            <View style={{width: 1000, paddingHorizontal: 10}}>
                <View style={{height: "100%", flexDirection: 'row', paddingBottom: 10}}>
                    {renderYAxis()}
                    <LineChart
                        style={{ flex: 1 }}
                        data={ data }
                        yAccessor={ ({ item }) => item.time }
                        xAccessor={ ({ item }) => item.date }
                        xScale={ scale.scaleTime }
                        svg={{ stroke: 'rgb(134, 65, 244)'}}
                        contentInset={contentInset}
                    >
                        <Grid />
                    </LineChart>
                </View>
                {renderXAxis()}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({});

export default LineGraph;