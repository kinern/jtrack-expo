import React, {Component} from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import Modal, { ModalTitle, ModalContent } from 'react-native-modals';
import Database from './Database';

const db = new Database();

const JMenuStyles = StyleSheet.create({
    jumpinput: {
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#FFFFFF',
        margin: 10,
        padding: 0 
    },
    jumpmodalbox: {
        backgroundColor: '#fff',

    },
    jumpmodaltitle: {
        color: '#2c2a3b',
        backgroundColor: '#fff',
    }
});


class JumpMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
          visible: false,
          jumps: '',
          year: '',
          month: '',
          day: '',
          jumpinput: ''
        };
    }

    createDateTimeStr = (year, month, day) => {
        month = (month.toString().length < 2)? '0' + month.toString() : month;
        day = (day.toString().length < 2)? '0' + day.toString() : day; 
        return year + '-' + month + '-' + day + ' 00:00:00';
    }

    //Open Jump Menu
    openNewMenu = ({year, month, day}) => {
        var that = this;
        action_date = that.createDateTimeStr(year, month, day);
        db.getJumps(action_date).then((data) => {
          that.setState({
            jumps : data,
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
            jumps : '0',
            visible : true
          }
        });
    }

    //Save Jumps from jumpinput
    saveJumps = () => {
        var that = this;
        if (this.state.jumpinput == this.state.jumps) {
            this.props.updateJumpChanges();
            that.closeMenu();
            return;
        }
        var action_date = that.createDateTimeStr(this.state.year, this.state.month, this.state.day);
        db.saveJumps(this.state.jumpinput, action_date).then((data) => {
            this.props.updateJumpChanges();
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
                <ModalTitle style={JMenuStyles.jumpmodaltitle}
                title={'Jumps For ' + this.state.month + '/' + this.state.day} />
                }
                swipeDirection={['up', 'down']} // can be string or an array
                swipeThreshold={200} // default 100
                onSwipeOut={(event) => {
                this.setState({ visible: false });
                }}
            >
                <ModalContent style={JMenuStyles.jumpmodalbox}>
                <TextInput 
                name="jumpinput"
                onChange={(event) => this.setState({jumpinput: event.nativeEvent.text}) }
                keyboardType={'numeric'} 
                style={JMenuStyles.jumpinput}
                placeholder={this.state.jumps.toString()} 
                />
                <Button color="#394e7d"
                title="Submit" onPress={this.saveJumps} />
                </ModalContent>
            </Modal>
            </View>
        ); 
    }
}

export default JumpMenu;