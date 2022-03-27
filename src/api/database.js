import * as SQLite from 'expo-sqlite';
import testTableInserts from '../testTableInserts';

import {
    SQLDateToJSDate,
    resultsIntoArray,
    dateTimeToSQLString,
} from './utils/utils';

const database_name = 'jtrack.db';

const exerciesCreateQuery = 
`CREATE TABLE IF NOT EXISTS exercises(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    time INTEGER, 
    date DATETIME
)`;

//Note: SQLite doesn't have a boolean value, so int is used instead.
const goalsCreateQuery = 
`CREATE TABLE IF NOT EXISTS goals(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    sun INTEGER DEFAULT 0, 
    mon INTEGER DEFAULT 0, 
    tue INTEGER DEFAULT 0, 
    wed INTEGER DEFAULT 0, 
    thu INTEGER DEFAULT 0, 
    fri INTEGER DEFAULT 0, 
    sat INTEGER DEFAULT 0, 
    minutes INTEGER DEFAULT 0
)`;

const insertGoalQuery = 
`INSERT INTO goals (
    mon, 
    tue, 
    wed, 
    thu, 
    fri, 
    sat, 
    sun, 
    minutes) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

const fetchMonthlyGoalsQuery = 
`SELECT 
strftime("%m", date) AS month, 
SUM(time) AS minutes 
FROM exercises 
WHERE date > ? AND date < ? 
GROUP BY strftime("%m", date)`;

const defaultGoals = {'mon':0, 'tue':0, 'wed':0, 'thu':0, 'fri':0, 'sat':0, 'sun':0, 'minutes':0};

const createQueries = {
    'goals': goalsCreateQuery,
    'exercises': exerciesCreateQuery
};

export default class DB{
    constructor(){
        this.db = SQLite.openDatabase(database_name);
    }

    async setupDatabase(){
        return new Promise((resolve, reject)=> {
            this.db.transaction((txn) => {this.setupTable(txn, 'exercises', false, reject)});
            this.db.transaction((txn) => {this.setupTable(txn, 'goals', resolve, reject)});
        }, (err)=>{console.log(err)}, ()=>{console.log('setupDatabase transaction success')});
    }


    setupTable(txn, tableName, resolve, reject){

        const selectQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name=?";
        const dropQuery = 'DROP TABLE IF EXISTS ?';
        const createQuery = createQueries[tableName];
        txn.executeSql(
            selectQuery,
            [tableName],
            function(txn, res) {
                if (typeof resolve !== 'function'){
                    reject(`error with setting up ${tableName} table`);
                }
                if (res.rows.length != 0) { //Testing...?
                    resolve(`finished creating ${tableName}`);
                    return;
                }
                txn.executeSql(dropQuery, [tableName]);
                txn.executeSql(
                    createQuery,
                    [],
                    (txn, res)=>resolve(`finished creating ${tableName}`),
                    (txn, err)=>reject(err),
                );
                //resolve(`finished creating ${tableName}`);
            },
            (txn, err)=>{
                console.log(err);
                reject(`error with setting up ${tableName} table`);
            }
        );
    };

    

    //Goal functions
    fetchGoal(){
        return new Promise ((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql(
                        'SELECT * FROM goals LIMIT 1',
                        [],
                        (txn, results) => {
                            (results.rows.length > 0)? resolve(results.rows.item(0)) : resolve(defaultGoals);
                        },
                        (txn, err)=>{
                            reject(err);
                        }
                    );
                }
            );
        });
    };


    updateGoal(weekdays, minutes){

        const insertArguments = [
            weekdays['mon'], 
            weekdays['tue'],
            weekdays['wed'],
            weekdays['thu'],
            weekdays['fri'],
            weekdays['sat'],
            weekdays['sun'],
            minutes
        ];

        return new Promise ((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql('DELETE FROM goals');
                    txn.executeSql(
                        insertGoalQuery,
                        insertArguments,
                        (txn, results) => {
                            resolve('updated goal');
                        },
                        (txn, err) => {
                            reject('update goal failed');
                        }
                    );
                }
            );
        });
    };

    
    //Six Month Graph
    fetchMonthlyTotals (date) {
        //Get 1st of startDate and last of endDate.

        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const startDateCopy = startDate;
        const endDate = new Date(startDateCopy.setMonth(startDateCopy.getMonth()-5), 0);
        const startStr = dateTimeToSQLString(startDate);
        const endStr = dateTimeToSQLString(endDate);

        return new Promise ((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql(
                        fetchMonthlyGoalsQuery,
                        [startStr, endStr],
                        (txn, res)=>{
                            const resultsArray = resultsIntoArray(res);
                            resolve(resultsArray);
                        },
                        (txn, err)=> {
                            reject(err);
                        }
                    );
                }
            );
        });
    }


    fetchCalendarExercises () {

    }

    fetchGraphExercises () {

    }

    //Fetch Exercises
    fetchExercises (startDate)  {

        //Ensures starting data for selection is first day of month.
        startDate.setDate(1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 0);
        const startDateStr = dateTimeToSQLString(startDate);
        const endDateStr = dateTimeToSQLString(endDate);
    
        return new Promise ((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql(
                        'SELECT * FROM exercises WHERE date >= ? AND date <= ?',
                        [startDateStr, endDateStr],
                        (txn, res) => {
                            const results = resultsIntoArray(res);
                            resolve(results);
                        },
                        (txn, err)=>{
                            reject(err);
                        }
                    );
                }, 
                (err)=>{console.log(err)}, 
                ()=>{console.log('fetch transaction success callback')}
            );
        });
    }


    //Fetch One Exercise
    fetchExercise (date) {
        const sqlDate = dateTimeToSQLString(date);
        return new Promise((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql(
                        'SELECT * FROM exercises WHERE date = ? LIMIT 1'
                        ,[sqlDate]
                        ,(txn, res)=>{
                            let foundDate = {date: date, time: "0"};
                            if (res.rows.length != 0){
                                const firstRow = res.rows.item(0);
                                foundDate = {date: date, time: firstRow.time};
                            }
                            resolve(foundDate);
                        }
                        ,(txn, err)=>{
                            reject(err);
                        }
                    );
                }, 
                (err)=>{console.log(err)}, 
                ()=>{console.log('fetchExercise transaction success callback')}
            );
        });
    }


    //Clear Database
    clearDatabaseData () {
        console.log('clear database data');
        return new Promise((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql('DROP TABLE IF EXISTS exercises');
                    txn.executeSql(
                        'CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, date DATETIME)'
                        ,[]
                        ,(txn, results)=>{
                            resolve('cleared');
                        }
                        ,(txn, err)=>{reject(err)}
                    );
                },
                (err)=>{console.log(err)}, 
                ()=>{console.log('drop/create transaction success callback')}
            );
        });
    }


    //Insert Test Data
    insertTestData () {
        return new Promise((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql( 
                        testTableInserts
                        ,[]
                        ,(txn, results)=>{
                            resolve('added test records');
                        }
                        ,(txn, err)=>{reject(err)}
                    );
                },
                (err)=>{console.log(err)}, 
                ()=>{console.log('insert transaction success callback')}
            );
        });
    }


    //Save Exercise
    saveExercise  (date, time) {

        const insertQuery = 'INSERT INTO exercises (time, date) VALUES (?,?)';
        const updateQuery = 'UPDATE exercises SET time = ? WHERE date = ?';
        const sqlDate = dateTimeToSQLString(date);

        return new Promise((resolve)=>{ 
            this.db.transaction(
                txn => {
                    txn.executeSql(
                        'SELECT * FROM exercises WHERE date = ?',
                        [sqlDate],
                        (tx, res) => {
                            const query = (res.rows.length == 0)? insertQuery : updateQuery;
                            const successMessage = (res.rows.length == 0)? 'Exercise Inserted': 'Exercise Updated';
                            tx.executeSql(
                                query
                            ,[time, sqlDate],
                            (txn, res)=>{
                                resolve(successMessage);
                            },
                            (txn, err)=>{
                                reject(err);
                            });
                        }
                    );
                },
                (err)=>{console.log(err)}, 
                ()=>{console.log('save transaction success callback')}
            );
        });
    }



}
 
