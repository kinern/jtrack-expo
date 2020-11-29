import createDataContext from './createDataContext';
import {
    fetchExercises as DBfetchExercises,
    saveExercise as DBSaveExercise,
    fetchExercise as DBFetchExercise
} from '../api/database';

import testExerciseData from '../testExerciseData';

const exerciseReducer = (state, action)=>{
    switch(action.type){
        case 'fetch_graph_ex':
            return {...state, graphExercises: action.payload};
        case 'fetch_calendar_ex':
            return {...state, calendarExercises: action.payload};
        case 'fetch_exercise':
            return {...state, exercise: action.payload};
        case 'save_exercise':
            return state;
        case 'error':
            return {...state, error:action.payload}; 
        default:
            return state;
    }
};

//Get exercises data for calendar screen.
const fetchCalendarExercises = dispatch => async (startDate, endDate) =>{

    try {
        //let results = DBfetchExercises(startDate, endDate);
        let results = testExerciseData;
        
        const exercisesObj = {};
        results.map((item)=>{
            let date = item.date.slice(0, -9);
            exercisesObj[date] = {marked: true, minutes: item.time};
        }); 
        dispatch({type:'fetch_calendar_ex', payload: exercisesObj});
    } catch (err){
        dispatch({type: 'error', payload: 'Fetch Calendar Data Failed.'});
    }
};

//Graph Screen Exercises
const fetchGraphExercises = dispatch => async (startDate) =>{

    try{
        //let results = DBfetchExercises(startDate, endDate);
        let results = testExerciseData;

        //Formatting database results to work wth line graph component.
        const resultsObj = {};
        results.map((item)=>{
            let newDate = SQLDateToJSDate(item.date);
            if (
                newDate.getMonth() === (startDate.getMonth()) &&
                (newDate.getFullYear() == startDate.getFullYear())
                ){
                let day = parseInt(item.date.slice(8, -9));
                resultsObj[day] = {time: item.time, date: newDate};
            }
        });

        //Inserting default date data for line graph data points.
        const resultsArray = [];
        const daysInMonth = getDaysInMonth(startDate.getMonth(), startDate.getFullYear())
        for (let day = 1; day <= daysInMonth; day++){
            if (resultsObj[day]){
                resultsArray.push(resultsObj[day]);
            } else {
                let zeroDate = new Date(startDate.getFullYear(), startDate.getMonth(), day, 0,0);
                let zeroEntry = {time: 0, date: zeroDate};
                resultsArray.push(zeroEntry);
            }
        }

        dispatch({type:'fetch_graph_ex', payload: resultsArray});
    } catch (err){
        dispatch({type: 'error', payload: 'Fetch Graph Data Failed.'});
    }

};

//Helper function to get number of days in the month.
function getDaysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
};

//Helper function to convert a SQL DATETIME string to Javascript DateTime object.
const SQLDateToJSDate = (sqldate) => {
    const t = sqldate.split(/[- :]/);
    const d = new Date(t[0], t[1]-1, t[2], 0, 0);
    return d;
};

//Returns exercise info given a date.
const fetchExerciseFromDateStr = dispatch => async (date) => {
    try{
        //const result = await DBfetchExercise(date);
        //let exercise = result.rows[0];
        //let convertedDate = SQLDateToJSDate(results.rows[0].item.date);
        let exercise = {time: 10, date: '2020-11-25 00:00:00'};
        dispatch({type: 'fetch_exercise', payload: exercise});
    } catch (err){
        dispatch({type: 'error', payload: 'Fetch Failed.'});
    }
};

const saveExercise = dispatch => async (date, minutes, callback) => {
    try {
        const result = await DBSaveExercise(date, minutes);
        console.log('saved exercise:', date, minutes);
        dispatch({type: 'exercise_saved', payload: result});
    } catch(err) {
        dispatch({type: 'error', payload: 'Save Failed.'});
    }
   callback();
};

let defaultDate = new Date();
let month = String(defaultDate.getMonth()+1).padStart(2, '0');
let day = String(defaultDate.getDate()).padStart(2, '0');
let year = defaultDate.getFullYear();
defaultDate = year +'-'+ month +'-'+ day;

export const {Context, Provider} = createDataContext(
    exerciseReducer,
    {fetchCalendarExercises, fetchGraphExercises, fetchExerciseFromDateStr, saveExercise},
    {
        selectedDate: defaultDate, 
        calendarExercises: null, 
        graphExercises: null, 
        exercise: {time: 0, date: '2020-01-01 00:00:00'}
    }
);