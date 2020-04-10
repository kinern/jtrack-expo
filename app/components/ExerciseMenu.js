import React, {Component} from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import Modal, { ModalTitle, ModalContent } from 'react-native-modals';
import Database from './Database';

const db = new Database();

const JMenuStyles = StyleSheet.create({
    minuteInput: {
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#FFFFFF',
        margin: 10,
        padding: 0 
    },
    MinuteModalBox: {
        backgroundColor: '#fff',

    },
    MinuteModalTitle: {
        color: '#2c2a3b',
        backgroundColor: '#fff',
    }
});


class ExerciseMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          minutes: '',
          year: '',
          month: '',
          day: '',
          minutesInput: ''
        };
    }

    createDateTimeStr = (year, month, day) => {
        month = (month.toString().length < 2)? '0' + month.toString() : month;
        day = (day.toString().length < 2)? '0' + day.toString() : day; 
        return year + '-' + month + '-' + day + ' 00:00:00';
    }

    //Open Exercise Menu
    openNewMenu = ({year, month, day}) => {
        var that = this;
        action_date = that.createDateTimeStr(year, month, day);
        db.getExercise(action_date).then((data) => {
          that.setState({
            minutes : data,
            year: year,
            month: month,
            day: day,
            visible : true
          });
        }).catch((err) => {
          console.log(err);
          that.setState = {
            year: year,
            month: month,
            day: day,
            minutes : '0',
            visible : true
          }
        });
    }

    //Save Exercise from minuteInput
    saveExercise = () => {
        var that = this;
        if (this.state.minutesInput == this.state.minutes) {
            this.props.updateMinuteChanges();
            that.closeMenu();
            return;
        }
        var action_date = that.createDateTimeStr(this.state.year, this.state.month, this.state.day);
        db.saveExercise(this.state.minutesInput, action_date).then((data) => {
            this.props.updateMinuteChanges();
        });
        that.closeMenu();
    }

    //Close Menu
    closeMenu = () => {
        this.setState({ visible : false });
    }

    render() {
        return (
            <View>
            <Modal
                style={JMenuStyles.modal}
                visible={this.state.visible}
                modalTitle={
                <ModalTitle style={JMenuStyles.minuteModalTitle}
                title={'Minutes For ' + this.state.month + '/' + this.state.day} />
                }
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onSwipeOut={(event) => {
                this.setState({ visible: false });
                }}
            >
                <ModalContent style={JMenuStyles.minuteModalBox}>
                <TextInput 
                name="minutesInput"
                onChange={(event) => this.setState({minutesInput: event.nativeEvent.text}) }
                keyboardType={'numeric'} 
                style={JMenuStyles.minuteInput}
                placeholder={this.state.minutes.toString()} 
                />
                <Button color="#394e7d"
                title="Submit" onPress={this.saveExercise} />
                </ModalContent>
            </Modal>
            </View>
        ); 
    }
}

export default ExerciseMenu;