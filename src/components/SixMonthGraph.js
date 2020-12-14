import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import colors from '../theme/colors';

const SixMonthGraph = ({ data }) => {

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const contentInset = { top: 20, bottom: 20, left: 5, right: 20 }


    const renderYAxis = () => {
        return (
            <YAxis
            data={data.map(item=>item.minutes)}
            contentInset={contentInset}
            svg={{fontSize: 10, fill: colors.inactiveDark}}
            numberOfTicks={5}
            formatLabel={(value) => `${value}`}
            showGrid={false}
            />
        );
    }


    const renderXAxis = () => {
        return (
            <XAxis
            data={data}
            xAccessor={ ({ item }) => item.month }
            formatLabel={(value)=>monthNames[parseInt(value)-1]}
            contentInset={{right: 60, left: 60}}
            svg={{ fontSize: 14, fill: colors.inactiveDark }}
            style={{marginTop: 10}}
            />
        );
    }


    return (
        <View style={{paddingHorizontal: 10}}>
            <View style={{height: 120, flexDirection: 'row' }}>
                {renderYAxis()}
                <BarChart
                    style={{ flex: 1 }}
                    data={ data }
                    yAccessor={ ({ item }) => item.minutes }
                    xAccessor={ ({ item }) => item.month }
                    svg={{ fill: colors.inactiveDark }}
                    contentInset={contentInset}
                    showGrid={false}
                >
                    <Grid />
                </BarChart>
            </View>
            {renderXAxis()}
        </View>
    );
};


const styles = StyleSheet.create({});


export default SixMonthGraph;