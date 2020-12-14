import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Image} from 'react-native';
import {Text} from 'react-native-elements';

import TodayBox from '../components/TodayBox';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../theme/colors';

import logoImage from '../assets/images/calendar/jumprope.png';

const Header = ({title}) => {

    const [modalVisible, setModalVisible] = useState(false);

    //Renders the "Today" toggle button next to the title.
    const renderModalButton = () => {
        return(
            <TouchableOpacity
            style={styles.weatherBtn}
            onPress={()=>{setModalVisible(!modalVisible)}}
            >
                <Icon name="weather-sunny" size={30} color={colors.highlight}/>
            </TouchableOpacity>
        );
    }


    return (
        <View style={styles.header}>
            <TodayBox 
            modalVisible={modalVisible}
            changeModalVisible={(val)=>{setModalVisible(val)}} 
            />
            <View style={styles.titleLogo}>
                <Image style={styles.logo} source={logoImage} />
                <Text style={styles.title}>JTrack</Text>
            </View>
            {renderModalButton()}
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