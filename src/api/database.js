import * as SQLite from 'expo-sqlite';
import testTableInserts from '../testTableInserts';

const database_name = 'jtrack.db';

export default class DB{
    constructor(){
        this.db = SQLite.openDatabase(database_name);
    }

    setupDatabase = async () => {

        return new Promise((resolve, reject)=> {
            this.db.transaction((txn) => {
                txn.executeSql(
                    "SELECT name FROM sqlite_master WHERE type='table' AND name='exercises'",
                    [],
                    function(txn, res) {
                      if (res.rows.length != 0) {
                        txn.executeSql('DROP TABLE IF EXISTS exercises', []);
                        txn.executeSql(
                          'CREATE TABLE IF NOT EXISTS exercises(id INTEGER PRIMARY KEY AUTOINCREMENT, time INTEGER, date DATETIME)'
                          ,[]
                          ,(txn, results)=>{
                            txn.executeSql( testTableInserts
                                ,[]
                                ,(txn, result)=>{resolve('setup and inserts completed')}
                                ,(txn, err)=>{reject(err)}
                            );
                          }
                          ,(txn, err)=>{reject(err)}
                        );
                      } else {
                          resolve("found exercise table.");
                      }
                    },
                    (txn, err)=>{
                        console.log(err);
                    }
                );
            });
        }, (err)=>{console.log(err)}, ()=>{console.log('transaction success callback')});
    }

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
                        (txn, results) => {
                            let res = [];
                            for (let i = 0; i < results.rows.length; i++){
                                res.push({...results.rows.item(i)});
                            }
                            resolve(res);
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

    saveExercise  (date, time) {

        const results = [];
        const sqlDate = this.dateTimeToSQLString(date);
    
        return new Promise((resolve)=>{ 
            this.db.transaction(
                txn => {
                    //Check if record exists for date
                    txn.executeSql(
                        'SELECT * FROM exercises WHERE date = ?;',
                        [date],
                        (tx, res) => {
                            if (res.rows.length == 0){
                                //Add new record
                                tx.executeSql(
                                    'INSERT INTO exercises (time, date) VALUES (?,?);'
                                ,[time, sqlDate]);
                            } else {
                                //Update existing record
                                tx.executeSql(
                                    'UPDATE exercises SET time = ? WHERE date = ?;'
                                ,[time, sqlDate]);
                            }
                            resolve(fetchExercises(date));
                        }
                    );
            });
        });
    }

    //Helper function to convert a Javascript DateTime object to a SQL DATETIME string.
    dateTimeToSQLString (date) {
        const pad = function(num) { return ('00'+num).slice(-2) };
        return date.getUTCFullYear() + '-' + 
            pad(date.getUTCMonth() + 1) + '-' + 
            pad(date.getUTCDate()) + " 00:00:00";
    }

}
 
