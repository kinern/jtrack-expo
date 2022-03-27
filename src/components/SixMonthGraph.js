import React from 'react';
import {View, StyleSheet} from 'react-native';
import { BarChart, Grid, YAxis, XAxis } from 'react-native-svg-charts';
import colors from '../theme/colors';
import {monthNamesShort as monthNames} from '../data/graphData';

const SixMonthGraph = ({ data }) => {

    const contentInset = { top: 20, bottom: 20, left: 5, right: 20 }

    if (data.length < 6){
        let monthIndex = (data[data.length-1] != null)? parseInt(data[data.length-1].month)-1 : 0;
        while (data.length <= 6){
            data.unshift({month: monthIndex, minutes: 0});
            monthIndex = (monthIndex === 0)? 11 : monthIndex-1;
        }
    }


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
            contentInset={{left: -20, right: 40}}
            svg={{ fontSize: 14, fill: colors.dark }}
            style={{marginTop: 10}}
            />
        );
    }


    return (
        <View style={{paddingHorizontal: 20}}>
            <View style={{height: "80%", flexDirection: 'row' }}>
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