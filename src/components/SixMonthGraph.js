import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts'
import * as scale from 'd3-scale'
import colors from '../theme/colors';

const SixMonthGraph = ({}) => {

    //const months = ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'];

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const contentInset = { top: 20, bottom: 20, left: 5, right: 20 }
    let data = [
        {time: 100, date: new Date(2020, 9, 1)},
        {time: 200, date: new Date(2020, 10, 1)},
        {time: 130, date: new Date(2020, 11, 1)},
        {time: 150, date: new Date(2020, 12, 1)},
        {time: 90, date: new Date(2021, 1, 1)},
        {time: 100, date: new Date(2021, 2, 1)}
    ];

    return (
        <View style={{paddingHorizontal: 10}}>
            <View style={{height: 120, flexDirection: 'row' }}>
                <YAxis
                    data={data.map(item=>item.time)}
                    contentInset={contentInset}
                    svg={{fontSize: 10, fill: colors.inactiveDark}}
                    numberOfTicks={5}
                    formatLabel={(value) => `${value}`}
                    showGrid={false}
                />
                <BarChart
                    style={{ flex: 1 }}
                    data={ data }
                    yAccessor={ ({ item }) => item.time }
                    xAccessor={ ({ item }) => item.date }
                    xScale={ scale.scaleTime }
                    svg={{ fill: colors.inactiveDark }}
                    contentInset={contentInset}
                    showGrid={false}
                >
                    <Grid />
                </BarChart>
            </View>
            <XAxis
                data={data}
                xAccessor={ ({ item }) => item.date }
                scale={ scale.scaleTime }
                formatLabel={(date)=>{return monthNames[date.getMonth()]}}
                contentInset={{right: 45, left: 45}}
                svg={{ fontSize: 14, fontWeight: '700', fill: colors.inactiveDark }}
                style={{ marginTop: 10 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({

});

export default SixMonthGraph;