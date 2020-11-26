import createDataContext from './createDataContext';
import {
    fetchExercises as DBfetchExercises,
    saveExercise as DBSaveExercise,
    fetchExercise as DBFetchExercise
} from '../api/database';

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
    let results = [
        {date: '2020-11-17 00:00:00', time: 10},
        {date: '2020-11-18 00:00:00', time: 20},
        {date: '2020-11-06 00:00:00', time: 30},
        {date: '2020-11-05 00:00:00', time: 40}
    ];
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

//Get exercises for graph screen.
const fetchGraphExercises = dispatch => async (startDate, endDate) =>{

    try{
        //let results = DBfetchExercises(startDate, endDate);
        let results = [
            {date: '2020-11-17 00:00:00', time: 10},
            {date: '2020-11-18 00:00:00', time: 20},
            {date: '2020-11-06 00:00:00', time: 30},
            {date: '2020-11-05 00:00:00', time: 40}
        ];
        const resultsObj = {};
        results.map((item)=>{
            let day = parseInt(item.date.slice(8, -9));
            resultsObj[day] = {time: item.time, date: SQLDateToJSDate(item.date)};
        });
    
        const resultsArray = [];
        for (let day = 1; day <= daysInMonth(startDate.getMonth(), startDate.getFullYear()); day++){
            if (resultsObj[day]){
                //Add object to array
                resultsArray.push(resultsObj[day]);
            } else {
                //Insert entry with 0 minutes
                let zeroEntry = {time: 0, date: new Date(startDate.getFullYear(), startDate.getMonth()-1, day, 0,0)};
                resultsArray.push(zeroEntry);
            }
        }
    
        dispatch({type:'fetch_graph_ex', payload: resultsArray});
    } catch (err){
        dispatch({type: 'error', payload: 'Fetch Graph Data Failed.'});
    }

};

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
};

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
    {selectedDate: defaultDate, calendarExercises: null, graphExercises: null, exercise: {time: 0, date: '2020-01-01 00:00:00'}}
);