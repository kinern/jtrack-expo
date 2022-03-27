import { createSlice } from '@reduxjs/toolkit'
import DB from '../api/database';

const db = new DB();

export const fetchCalendarExercises = createAsyncThunk(
  'exercise/fetchCalendarExercises',
  async (query, thunkAPI) => {
    const response = await db.fetchCalendarExercises(query);
    return response.data;
  }
)

export const fetchGraphExercises = createAsyncThunk(
  'exercise/fetchGraphExercises',
  async (query, thunkAPI) =>{
    const response = await db.fetchGraphExercises(query);
    return response.data;
  }
)

export const fetchMonthlyTotals = createAsyncThunk(
  'exercise/fetchMonthlyTotals',
  async (query, thunkAPI) =>{
    const response = await db.fetchMonthlyTotals(query);
    return response.data;
  }
);

export const clearAllExercises = createAsyncThunk(
  'exercise/clearAllExercises',
  async (data, thunkAPI) =>{
    const response = await db.clearAllExercises(data);
    return response.data;
  }
);

export const fetchExercise = createAsyncThunk(
  'exercise/fetchExercise',
  async (data, thunkAPI) =>{
    const response = await db.fetchExercise(data);
    return response.data;
  }
);

export const saveExercise = createAsyncThunk(
  'exercise/saveExercise',
  async (data, thunkAPI) =>{
    const response = await db.saveExercise(data);
    return response.data;
  }
);

export const fetchGoal = createAsyncThunk(
  'exercise/fetchGoal',
  async (query, thunkAPI) =>{
    const response = await db.fetchGoal(query);
    return response.data;
  }
);

export const saveGoal = createAsyncThunk(
  'exercise/saveGoal',
  async (data, thunkAPI) =>{
    const response = await db.saveGoal(data);
    return response.data;
  }
);

export const insertTestData = createAsyncThunk(
  'exercise/insertTestExerciseData',
  async (data, thunkAPI) =>{
    const response = await db.insertTestExerciseData(data);
    return response.data;
  }
);

const initialState = {
  calendarData : {}, //All exercise data for calendar
  exerciseData : {}, //Data for single exercise
  goal : {}, //Data for goal
  graphData: {}, //All exercise data for graphs
  monthlyTotals : [], //Montly total data for graphs
  selectedDate: new Date(), //Selected date when updating/adding exercise
}

export const exerciseSlice = createSlice({
  name: 'exercise',
  initialState,
  reducers: {
  },
  extraReducers: {
    [fetchCalendarExercises.fulfilled] : (state, {payload})=> {
      state.calendarData = payload;
    },
    [fetchGraphExercises.fulfilled]: (state, {payload}) => {
      state.graphData = payload;
    },
    [fetchMonthlyTotals.fulfilled] : (state, {payload}) => {
      state.monthlyTotals = payload;
    },
    [fetchGoal.fulfilled] : (state, {payload}) => {
      state.goal = payload;
    },
    [fetchExercise.fulfilled] : (state, {payload}) => {
      state.exerciseData = payload;
    },
    [saveGoal.fulfilled] : (state, {payload}) => {
      state.goal = payload;
    },
    [insertTestData.fulfilled] : (state, {payload}) => {
    },
  }
})


export default exerciseSlice.reducer;
export const exerciseSelector = state => state.exercise;