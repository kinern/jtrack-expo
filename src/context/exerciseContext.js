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
        default:
            return state;
    }
};

const fetchExercises = dispatch => async () => {
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

export const {Context, Provider } = createDataContext(
    exerciseReducer,
    {fetchExercises, fetchExercise, saveExercise},
    {exercises: []}
);