import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button} from 'react-native-elements';

const OptionsScreen = () =>{
    return (
        <View style={styles.container}>
            <Text h2>Options</Text>
            <View style={{margin: 20, borderWidth: 1, borderRadius: 5, borderColor: 'lightgray', alignItems: 'center'}}>
                <Text h4>Weather Degrees</Text>
                <View style={{flexDirection:'row' }}>
                    <Button style={{margin: 10}} title="Celcius" />
                    <Button style={{margin: 10}} title="Fahrenheit" />
                </View>
            </View>
            <Button style={styles.btn} title="Export Data" />
            <Button style={styles.btn} title="Import Data" />
            <Button style={styles.btn} title="Clear Data" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    btn: {
        margin: 20,
        width: 200
    }
});

export default OptionsScreen;