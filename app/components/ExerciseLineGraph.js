import React, { Component } from 'react';
import { View, Dimensions } from 'react-native'; 
import { LineChart, BarChart } from 'react-native-chart-kit';
import Database from '../components/Database';

const db = new Database();

class ExerciseLineGraph extends Component {
  constructor(props){
    super(props);
    var date = new Date();
    this.state = {
      selectedMonth: this.props.selectedMonth,
      selectedMonthNum: this.props.selectedMonthNum,
      selectedYear: this.props.selectedYear,
      graphData: [100,100,200,300,400,400,100,400,400,400,400,0,0,0,100,200,300,400,400,400,0,0,0,100,200,300,400,400,400,]
    };
  }

  componentDidMount = () => {
    this.updateGraph();
  }

  updateDates = ({newMonth, newMonthNum, newYear}) => {
    return new Promise((resolve) => {
      this.setState({
        selectedMonth: newMonth,
        selectedMonthNum: newMonthNum,
        selectedYear: newYear
      });
      resolve();
    });
  }

  updateGraph = () => {
    console.log('update triggered');
    var month = this.state.selectedMonthNum;
    var year = this.state.selectedYear;
    var startDate = this.getStartDate({month, year});
    var endDate = this.getEndDate({month, year});
    this.getStats({startDate, endDate});
  }

  getStartDate = ({month, year}) =>{
    var startMonth = ("0" + (month + 1)).slice(-2);
    return year + "-" + startMonth + "-01 00:00:00";
  }

  getEndDate = ({month, year}) =>{
    var endMonth = (month == 12)? '01': ("0" + (month + 2)).slice(-2);
    var endYear = (month == 12)? (year + 1) : year;
    return endYear + "-" + endMonth + "-01 00:00:00";
  }

  getStats = ({startDate, endDate}) => {
    var that = this;
    db.getStatsFromDateRange({startDate, endDate}).then((data) => {
      that.setState({
        graphData: data
      });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() { 
    return ( 
        <View>
            <LineChart
              data={{
                labels: [],
                datasets: [{
                  data: this.state.graphData
                }]
              }}
              width={Dimensions.get("window").width - 30} // from react-native
              height={320}
              yAxisLabel=""
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: "#394e7d",
                backgroundGradientFrom: "#394e7d",
                backgroundGradientTo: "#394e7d",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "2",
                  strokeWidth: "2",
                  stroke: "#fff"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
        </View> 
      );
    }
}
 
export default ExerciseLineGraph;