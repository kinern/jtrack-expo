import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'react-native-elements';

const OptionsScreen = () =>{
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Options</Text>
            <View style={styles.degreeMenu}>
                <Text h4>Weather Degrees</Text>
                <View style={{flexDirection:'row' }}>
                    <TouchableOpacity style={styles.degreeBtnC}><Text style={styles.btnText}>C</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.degreeBtnF}><Text style={styles.btnText}>F</Text></TouchableOpacity>
                </View>
            </View>
            <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Export Data</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Import Data</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btn}><Text style={styles.btnText}>Clear Data</Text></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 24,
        fontWeight: '700',
        color: 'gray'
    },
    degreeBtnC: {
        padding: 10,
        marginTop: 5,
        width: 50,
        alignItems: 'center',
        backgroundColor: 'pink',
        elevation: 2
    },
    degreeBtnF:{
        padding: 10,
        marginTop: 5,
        width: 50,
        alignItems: 'center',
        backgroundColor: 'lightblue',
        elevation: 2
    },
    btn: {
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        padding: 20,
        width: 180,
        color: 'gray',
        elevation: 2
    },
    btnText: {
        fontSize: 20
    },
    degreeMenu: {
        margin: 20, 
        borderWidth: 1, 
        borderRadius: 2,
        borderColor: 'lightgray',
        alignItems: 'center',
        padding: 20
    }
});

export default OptionsScreen;