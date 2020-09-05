import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import LineGraph from '../components/LineGraph';

const StatsScreen = () =>{
    const navDate = new Date(2014, 1,1,0,0);
    const navDateStr = `${navDate.getMonth()} / ${navDate.getFullYear()}`;

    return (
        <View>
            <Text style={styles.header}>{navDateStr}</Text>
            <LineGraph style={styles.graph}/>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 20,
        alignSelf:'center',
        justifyContent: 'center',
        fontSize: 20,
        fontWeight: "700"
    }
});

export default StatsScreen;