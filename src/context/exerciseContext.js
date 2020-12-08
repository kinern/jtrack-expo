import createDataContext from './createDataContext';
import DB from '../api/database';

const db = new DB();


/*
exerciseContext Context

Contains reducer function, reducer actions, and default state object.
These are all parameters for createDataContext, which sets up and returns
a Context and Provider pair of Components.

*/
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
        case 'cleared_data':
            return state;
        case 'update_selected_date':
            return {...state, selectedDate: action.payload};
        case 'fetch_today_exercise':
            return {...state, todayExercise: action.payload};
        case 'update_goal_days':
            return {...state, goalDays: action.payload};
        case 'error':
            return {...state, error:action.payload}; 
        default:
            return state;
    }
};


//Changes the selectedDate state variable by a given amount of months.
/*
Note:
The syntax for these action functions are simplified from the following:
const actionName = (dispatch) => {
    return (params) => {
        ...
        dispatch({});
    }
}
*/
const updateSelectedDate = dispatch => (date, numOfMonths) => {
    date.setMonth(date.getMonth() + numOfMonths);
    dispatch({type: 'update_selected_date', payload: date});
}


//Fetches exercises and formats records to be compatible with the calendar component.
const fetchCalendarExercises = dispatch => (startDate) =>{

    db.fetchExercises(startDate)
    .then((results)=>{
        const exercisesObj = {};
        results.map((item)=>{
            let date = item.date.slice(0, -9);
            exercisesObj[date] = {marked: true, minutes: item.time};
        }); 
        dispatch({type:'fetch_calendar_ex', payload: exercisesObj});
    })
    .catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Fetch Calendar Data Failed.'});
    });

};


//Fetches exercises and formats records to be compatible with the graph component.
const fetchGraphExercises = dispatch => (startDate) =>{

    db.fetchExercises(startDate)
    .then((results)=>{
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
    })
    .catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Fetch Graph Data Failed.'});
    });

};


//Saves a single exercise record to the database. 
const saveExercise = dispatch => (date, minutes, callback) => {

    date = new Date(date);
    db.saveExercise(date, minutes).then((saved)=>{
        return db.fetchExercises(date);
    }).then((results)=>{
        dispatch({type: 'exercise_saved', payload: results});
        callback();
    }).catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Save Failed.'});
        callback();
    });
};


//Empties the database of all records.
const clearDatabase = dispatch => () => {
    db.clearDatabaseData()
    .then((results)=>{
        dispatch({type: 'cleared_data', payload: results});
    }).catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Clear Failed.'});
    });
}


//Inserts test data to database.
const insertTestData = dispatch => () => {
    db.insertTestData()
    .then((results)=>{
        dispatch({type: 'exercise_saved', payload: results});
    }).catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Insert Failed.'});
    });
}


//Fetches a single exercise record.
const fetchTodayExercise = dispatch => () => {
    const today = new Date();
    db.fetchExercise(today).then((result)=>{
        dispatch({type: 'fetch_today_exercise', payload: result});
    }).catch((err)=>{
        console.log('Error occured:', err);
        dispatch({type: 'error', payload: 'Fetch Failed.'});
    });
}

const updateGoalDays = dispatch => (goalDays) => {
    //Update in database
    dispatch({type: 'update_goal_days', payload: goalDays});
}


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


//Default value for state object's selectedDate value.
const defaultDate = new Date();


/*
Creates new Context and Provider pair,
using the above reducer function, action functions,
and default state object.
*/
export const {Context, Provider} = createDataContext(
    exerciseReducer,
    {
        fetchCalendarExercises, 
        fetchGraphExercises, 
        saveExercise,
        updateSelectedDate,
        clearDatabase,
        insertTestData,
        fetchTodayExercise
    },
    {
        selectedDate: defaultDate, 
        calendarExercises: null, 
        graphExercises: null, 
        todayExercise: {time: 0, date: '2020-01-01 00:00:00'}
    }
);