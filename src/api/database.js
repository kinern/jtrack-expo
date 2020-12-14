import * as SQLite from 'expo-sqlite';
import testTableInserts from '../testTableInserts';

const database_name = 'jtrack.db';


const exerciesCreateQuery = 
`CREATE TABLE IF NOT EXISTS exercises(
    id INTEGER PRIMARY KEY AUTOINCREMENT, 
    time INTEGER, 
    date DATETIME
)`;

//Note: SQLite doesn't have a boolean value, so int is used instead.
const goalsCreateQuery = 'CREATE TABLE IF NOT EXISTS goals(id INTEGER PRIMARY KEY AUTOINCREMENT, sun INTEGER DEFAULT 0, mon INTEGER DEFAULT 0, tue INTEGER DEFAULT 0, wed INTEGER DEFAULT 0, thu INTEGER DEFAULT 0, fri INTEGER DEFAULT 0, sat INTEGER DEFAULT 0, minutes INTEGER DEFAULT 0)';

const createQueries = {
    'goals': goalsCreateQuery,
    'exercises': exerciesCreateQuery
};

export default class DB{
    constructor(){
        this.db = SQLite.openDatabase(database_name);
    }


    setupDatabase = async () => {
        return new Promise((resolve, reject)=> {
            this.db.transaction((txn) => {this.setupTable(txn, 'exercises', false, reject)});
            this.db.transaction((txn) => {this.setupTable(txn, 'goals', resolve, reject)});
        }, (err)=>{console.log(err)}, ()=>{console.log('setupDatabase transaction success')});
    }


    setupTable(txn, tableName, resolve, reject) {

        const selectQuery = "SELECT name FROM sqlite_master WHERE type='table' AND name=?";
        const dropQuery = 'DROP TABLE IF EXISTS ?';
        const createQuery = createQueries[tableName];
        txn.executeSql(
            selectQuery,
            [tableName],
            function(txn, res) {
              if (res.rows.length == 0) { //Testing - resets table if != 0
                txn.executeSql(dropQuery, [tableName]);
                txn.executeSql(
                    createQuery,
                    [],
                    (txn, res)=>{
                        if (typeof resolve === 'function'){
                            resolve(`finished creating ${tableName}`);
                        }
                    },
                    (txn, err)=>{
                        reject(err);
                    }
                    
                );
                if (typeof resolve === 'function'){
                    resolve(`finished creating ${tableName}`);
                }
              } else {
                if (typeof resolve === 'function'){
                    resolve(`finished creating ${tableName}`);
                }  
              }
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
                            if (results.rows.length > 0){
                                resolve(results.rows.item(0));
                            } else {
                                const defaultGoals = {'mon':0, 'tue':0, 'wed':0, 'thu':0, 'fri':0, 'sat':0, 'sun':0, 'minutes':0};
                                resolve(defaultGoals);
                            }
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

        const insertQuery = 'INSERT INTO goals (mon, tue, wed, thu, fri, sat, sun, minutes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
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
                        insertQuery,
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
        const startStr = this.dateTimeToSQLString(startDate);
        const endStr = this.dateTimeToSQLString(endDate);

        const selectQuery = 'SELECT strftime("%m", date) AS month, SUM(time) AS minutes FROM exercises WHERE date > ? AND date < ? GROUP BY strftime("%m", date)';

        return new Promise ((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql(
                        selectQuery,
                        [startStr, endStr],
                        (txn, res)=>{
                            const resultsArray = this.resultsIntoArray(res);
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


    //Fetch Exercises
    fetchExercises (startDate)  {

        //Ensures starting data for selection is first day of month.
        startDate.setDate(1);
        const endDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 0);
        const startDateStr = this.dateTimeToSQLString(startDate);
        const endDateStr = this.dateTimeToSQLString(endDate);
    
        return new Promise ((resolve, reject)=>{
            this.db.transaction(
                txn => {
                    txn.executeSql(
                        'SELECT * FROM exercises WHERE date >= ? AND date <= ?',
                        [startDateStr, endDateStr],
                        (txn, res) => {
                            const results = this.resultsIntoArray(res);
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
        const sqlDate = this.dateTimeToSQLString(date);
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
        const sqlDate = this.dateTimeToSQLString(date);

        return new Promise((resolve)=>{ 
            this.db.transaction(
                txn => {
                    //Check if record exists for date
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


    //Helper function for putting result set into an array.
    resultsIntoArray (res) {
        const resultsArray = [];
        for(let i = 0; i < res.rows.length; i++){
            resultsArray.push({...res.rows.item(i)});
        }
        return resultsArray;
    }


    //Helper function to convert a Javascript DateTime object to a SQL DATETIME string.
    dateTimeToSQLString (date) {
        const pad = function(num) { return ('00'+num).slice(-2) };
        return date.getUTCFullYear() + '-' + 
            pad(date.getUTCMonth() + 1) + '-' + 
            pad(date.getUTCDate()) + " 00:00:00";
    }

}
 
