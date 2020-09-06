import createDataContext from './createDataContext';
import {
    fetchExercises as DBFetchExercises,
    saveExercise as DBSaveExercise,
    fetchExercise as DBFetchExercise
} from '../api/database';

const exerciseReducer = (state, action)=>{
    switch(action.type){
        case 'fetch_exercises':
            return {...state, exercises: action.payload};
        case 'save_exercise':
            return {...state, exercises: action.payload};    
        default:
            return state;
    }
};

const fetchExercises = dispatch => async (month = 1) => {
    const exercises = {
        '2020-09-17': {marked: true, minutes: 10},
        '2020-09-18': {marked: true, minutes: 20},
        '2020-09-06': {marked: true, minutes: 30},
        '2020-09-05': {marked: true, minutes: 50}
    };
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

export const {Context, Provider } = createDataContext(
    exerciseReducer,
    {fetchExercises, fetchExercise, saveExercise},
    {selectedDate: defaultDate, exercises: {}}
);