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
        case 'fetch_monthly_totals':
            return {...state, monthlyTotals: action.payload};
        case 'fetch_goal':
            return {...state, goal: action.payload};
        case 'save_goal':
            return {...state, goal: action.payload};
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
};


//Fetches exercises and formats records to be compatible with the calendar component.
const fetchCalendarExercises = dispatch => (startDate) =>{
    db.fetchExercises(startDate)
    .then((results)=>{
        const exercisesObj = convertToCalendarObject(results);
        dispatch({type:'fetch_calendar_ex', payload: exercisesObj});
    })
    .catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Fetch Calendar Data Failed.'});
    });
};


//Helper function that converts result set into calendar data object.
const convertToCalendarObject = (results) => {
    const calendarObject = {};
    results.map((item)=>{
        let date = item.date.slice(0, -9);
        calendarObject[date] = {marked: true, minutes: item.time};
    }); 
    return calendarObject;
}


//Fetches exercises and formats records to be compatible with the graph component.
const fetchGraphExercises = dispatch => (startDate) =>{
    db.fetchExercises(startDate)
    .then((results)=>{
        const graphData = convertToGraphObject(results, startDate);
        const graphArray = fillEmptyGraphData(graphData, startDate);
        dispatch({type:'fetch_graph_ex', payload: graphArray});
    })
    .catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Fetch Graph Data Failed.'});
    });
};


//Helper function to convert result set into correctly formatted graph data.
const convertToGraphObject = (results, startDate) => {
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
    return resultsObj;
}


//Helper function to add 0 min to days where exercises are not recorded yet.
const fillEmptyGraphData = (graphData, startDate) => {
    const resultsArray = [];
    const daysInMonth = getDaysInMonth(startDate.getMonth(), startDate.getFullYear())
    for (let day = 1; day <= daysInMonth; day++){
        if (graphData[day]){
            resultsArray.push(graphData[day]);
        } else {
            let zeroDate = new Date(startDate.getFullYear(), startDate.getMonth(), day, 0,0);
            let zeroEntry = {time: 0, date: zeroDate};
            resultsArray.push(zeroEntry);
        }
    }
    return resultsArray;
}


const fetchMonthlyTotals = dispatch => () => {
    db.fetchMonthlyTotals()
    .then((results)=>{
        dispatch({type: 'fetch_monthly_totals', payload: results})
    })
    .catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Fetch Monthly Totals Failed.'})
    })
};


//Saves a single exercise record to the database. 
const saveExercise = dispatch => (date, minutes, callback) => {
    if (typeof date === 'string' || date instanceof String){
        date = new Date(date);
    }
    db.saveExercise(date, minutes).then((saved)=>{
        dispatch({type: 'exercise_saved', payload: saved});
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
};


//Inserts test data to database.
const insertTestData = dispatch => () => {
    db.insertTestData()
    .then((results)=>{
        dispatch({type: 'exercise_saved', payload: results});
    }).catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Insert Failed.'});
    });
};


//Fetches a single exercise record.
const fetchTodayExercise = dispatch => () => {
    const today = new Date();
    db.fetchExercise(today).then((result)=>{
        console.log('fetch:', result);
        dispatch({type: 'fetch_today_exercise', payload: result});
    }).catch((err)=>{
        console.log('Error occured:', err);
        dispatch({type: 'error', payload: 'Fetch Failed.'});
    });
};


const fetchGoal = dispatch => (weekdays, minutes) => {
    //Update in database
    db.fetchGoal(weekdays, minutes).then((result)=>{
        dispatch({type: 'fetch_goal', payload: result});
    }).catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Fetch Goal Failed.'});
    });
};


const saveGoal = dispatch => (weekdays, minutes) => {
    //Update in database
    db.updateGoal(weekdays, minutes).then((result)=>{
        dispatch({type: 'save_goal', payload: result});
    }).catch((err)=>{
        console.log(err);
        dispatch({type: 'error', payload: 'Save Goal Failed.'});
    });
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
        fetchTodayExercise,
        fetchMonthlyTotals,
        saveGoal,
        fetchGoal
    },
    {
        selectedDate: defaultDate, 
        calendarExercises: null, 
        graphExercises: null, 
        todayExercise: {time: 0, date: '2020-01-01 00:00:00'},
        goal: {weekdays: {'sun': 0, 'mon': 0, 'tue': 0, 'wed': 0, 'thu': 0, 'fri': 0, 'sat': 0, }, minutes: "0"}
    }
);