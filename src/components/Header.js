import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import TodayBox from '../components/TodayBox';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

const images = { 
    logo : require('../assets/images/calendar/jumprope.png') 
};

const Header = () => {

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.header}>
            <TodayBox 
            modalVisible={modalVisible}
            changeModalVisible={(val)=>{setModalVisible(val)}} 
            />
            <View style={styles.titleLogo}>
                <Image style={styles.logo} source={images.logo} />
            </View>
            <TouchableOpacity
            style={styles.weatherBtn}
            onPress={()=>{setModalVisible(!modalVisible)}}
            >
                <Icon name="weather-sunny" size={30} color={colors.highlight}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems: 'center',
        width: '100%',
        paddingTop: 30,
        paddingHorizontal: 5,
        paddingBottom: 5,
        backgroundColor: colors.medium
    },
    titleLogo: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '30%'
    },
    middleSection: {
        width: '30%'
    },
    logo: {
        width: 45,
        height: 30,
        marginRight: 5
    },
    title: {
        fontWeight: '700',
        color: colors.highlight
    }
});

export default Header;