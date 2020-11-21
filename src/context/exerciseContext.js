import createDataContext from './createDataContext';
import {
    fetchExercises as DBFetchExercises,
    saveExercise as DBSaveExercise,
    fetchExercise as DBFetchExercise
} from '../api/database';

const exerciseReducer = (state, action)=>{
    switch(action.type){
        case 'fetch_exercises':
            console.log(action.payload);
            return {...state, exercises: action.payload};
        case 'save_exercise':
            return {...state, exercises: action.payload};    
        default:
            return state;
    }
};

const fetchExercises = dispatch => async (startDate, endDate, page="graph") => {
    
    let exercises;

    console.log("page", page);

    if (page === 'calendar'){
        exercises = {
            '2020-11-17': {marked: true, minutes: 10},
            '2020-11-18': {marked: true, minutes: 20},
            '2020-11-06': {marked: true, minutes: 30},
            '2020-11-05': {marked: true, minutes: 50}
        };
    }
    else {
        exercises = [
            {time: 50, date: new Date(2020, 11, 1, 0, 0)}, 
            {time: 10, date: new Date(2020, 11, 17, 0, 0)}, 
            {time: 40, date: new Date(2020, 11, 18, 0, 0)}, 
            {time: 20, date: new Date(2020, 11, 19, 0, 0)}, 
            {time: 40, date: new Date(2020, 11, 20, 0, 0)}, 
            {time: 70, date: new Date(2020, 11, 22, 0, 0)}, 
            {time: 15, date: new Date(2020, 11, 25, 0, 0)}, 
        ];
        //Insert dates where no exercise was done for the month so that the graph looks better?
    }


    dispatch({type:'fetch_exercises', payload: exercises});
    /*
    try{
        const result = await DBFetchExercises();
        dispatch({type: 'fetch_exercises', payload: result});
    } catch(err) {
        dispatch({type: 'error', payload: 'Fetching Exercises Failed.'});
    }
    */
}

const fetchExercise = dispatch => async (date) => {
    /*
    try{
        const result = await DBFetchExercise(date);
        dispatch({type: 'fetch_exercises', payload: result});
    } catch(err) {
        dispatch({type: 'error', payload: 'Fetching Exercise Failed.'});
    }
    */
}

const saveExercise = dispatch => async (date, minutes, callback) => {
    /*
    try {
        const result = await DBSaveExercise(date, minutes);
        dispatch({type: 'exercise_saved', payload: result});
    } catch(err) {
        dispatch({type: 'error', payload: 'Save Failed.'});
    }
    */
   callback();
}

let defaultDate = new Date();
let month = String(defaultDate.getMonth()+1).padStart(2, '0');
let day = String(defaultDate.getDate()).padStart(2, '0');
let year = defaultDate.getFullYear();
defaultDate = year +'-'+ month +'-'+ day;

export const {Context, Provider} = createDataContext(
    exerciseReducer,
    {fetchExercises, fetchExercise, saveExercise},
    {selectedDate: defaultDate, exercises: null}
);