import React, { Component } from 'react';
import { StyleSheet, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import ExerciseLineGraph from '../components/ExerciseLineGraph';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';


const statsStyles = StyleSheet.create({
  topcontainer: {
    backgroundColor: '#fff',
    color: '#2F4858',
    marginBottom: 10,
    borderColor: 'white',
    borderRadius: 3,
    borderWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  titletext: {
    color: "#fff",
    fontSize: 24,
    textAlign: 'center',
    fontWeight: "700",
  },
  graphcontainer: {
    width: '100%',
    height: '95%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: "#fff",
    marginBottom: -30,
  },
  graphnavicontainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  statsBackground: {
    width: '100%',
    height: '100%',
    opacity: 1,
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  nextbutton: {
    fontSize: 14,
  },
  monthname: {
    color: '#2F4858',
    fontSize: 20,
    fontWeight: "700",
  }
});


export default class StatsScreen extends Component {
  constructor(props){
    super(props);
    var date = new Date();
    this.ExerciseLineGraphElement = React.createRef();
    this.state = {
      selectedMonth: this.getMonthStr(date.getMonth()),
      selectedMonthNum: date.getMonth(),
      selectedYear: date.getFullYear(),
      isLoading: false,
    };
  }

  getMonthStr = (monthint) => {
    var monthnames = ['January','February','March','April','May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return monthnames[monthint];
  }


  //Increments or decements month and year
  getNewDateValues(type){
    var monthCheck = (type == 'inc')? 11 : 0;
    var diffYearMonth = (type == 'inc')? 0 : 11;
    var changeNum = (type == 'inc')? 1 : -1;
    var newMonthNum = this.state.selectedMonthNum;
    var newYear = this.state.selectedYear;

    if (newMonthNum == monthCheck){
      newMonthNum = diffYearMonth;
      newYear = newYear + changeNum;
    } else {
      newMonthNum = newMonthNum + changeNum;
    }
    var newMonth = this.getMonthStr(newMonthNum);
    return ({newMonth, newMonthNum, newYear});
  }

  
  changeDate = (type) => {
    if (!this.state.isLoading){
      this.setState({ isLoading : true});
      var newDateValues = this.getNewDateValues(type);
      var newMonth = newDateValues.newMonth;
      var newMonthNum = newDateValues.newMonthNum;
      var newYear = newDateValues.newYear;

      this.ExerciseLineGraphElement.current.updateDates({newMonth, newMonthNum, newYear})
      .then(() => {
        this.setState({
          selectedMonthNum: newMonthNum,
          selectedYear: newYear,
          selectedMonth: newMonth,
        });
        this.ExerciseLineGraphElement.current.updateGraph().then(()=>{
          this.setState({isLoading: false});
        });
      }).catch((err) => {
        console.log(err);
        this.setState({isLoading: false});
      });
    }
  } 

  updateGraph = () => {
    this.ExerciseLineGraphElement.current.updateGraph();
  }


  render() {
    return (
      <View>
        <ImageBackground style= { statsStyles.statsBackground } source={require(`../assets/images/purple-pink-bg.png`)}>
        <Text style={statsStyles.titletext}>STATISTICS</Text>
        <View style={statsStyles.graphcontainer}>
          <View>
            <View style={statsStyles.graphnavicontainer}>
              <TouchableOpacity style={{padding: 10}}
              onPress={() => { this.changeDate('dec'); }}
              ><FontAwesome name="caret-left" color={'#a8bfe6'} size={18} /></TouchableOpacity>
              <Text style={statsStyles.monthname}>{this.state.selectedMonth} {this.state.selectedYear}</Text>
              <TouchableOpacity style={{padding: 10}}
              onPress={() => { this.changeDate('inc'); }}
              ><FontAwesome name="caret-right" color={'#a8bfe6'} size={18} /></TouchableOpacity>
            </View>
          </View>
          <View>
            <ExerciseLineGraph 
            ref={this.ExerciseLineGraphElement}
            selectedMonth={this.state.selectedMonth} 
            selectedMonthNum = {this.state.selectedMonthNum} 
            selectedYear={this.state.selectedYear}
            />
          </View>
        </View>
        </ImageBackground>
      </View>
    );
  }
}
