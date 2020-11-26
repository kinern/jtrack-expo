import * as SQLite from 'expo-sqlite';
//import { openDatabase } from 'react-native-sqlite-storage';

var db = SQLite.openDatabase({ name: 'jtrack.db' });

export const setupDatabase = async () => {
    await db.transcation(
        function (t) {
            t.executeSql('DROP TABLE IF EXISTS exercises', []);
            t.executeSql(
                'CREATE TABLE IF NOT EXISTS exercises( '+
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'time INT(10), ' + 
                'date DATETIME, '+
                ')', 
                []
            );
            //Test data for exercise table.
            t.executeSql(
                "INSERT INTO exercises (time, date) VALUES " + 
                "(10, '2020-11-25 00:00:00') " +
                "(20, '2020-11-26 00:00:00')" +
                "(30, '2020-11-27 00:00:00') " +
                "(40, '2020-11-29 00:00:00') " +
                "(50, '2020-12-01 00:00:00') " +
                "(10, '2020-12-04 00:00:00') " +
                "(20, '2020-10-30 00:00:00')"
            )
        }
        ,[]
    );
}

const dateTimeToSQLString = (date) => {
    const pad = function(num) { return ('00'+num).slice(-2) };
    return date.getUTCFullYear() + '-' + 
        pad(date.getUTCMonth() + 1) + '-' + 
        pad(date.getUTCDate()) + ' ' +
        pad(date.getUTCHours()) + ':' +
        pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds());
};


export const fetchExercises = async (startDate, endDate) => {
    let results;
    const startDateStr = dateTimeToSQLString(startDate);
    const endDateStr = dateTimeToSQLString(endDate);
    
    await db.transcation(
        function (t) {
            t.executeSql(
                "SELECT time, date FROM sqlite_master WHERE type='table' AND name='exercises' WHERE date >= ? AND date <= ?",
                [startDateStr, endDateStr],
                function (tx, res){
                    results = res;
                }
            );
        }
    , []);
    return results;
}

//Get single exercise info from date.
export const getExerciseFromDate = async (date) =>{
    let results;
    await db.transcation(
        function(t){
            t.executeSql(
                "SELECT time FROM exercises WHERE date = ?"
            ),
            [],
            function (tx, res){
                result = (res.rows.length == 0)? 0 : res.rows[0].time;
            }
        } 
    ,[]);
    return results;
}

//Records new time and date for exercise.
export const saveExercise = async (time, date) =>{
    await db.transaction(
        function(t){
            //Check if record exists for date
            t.executeSql(
                "SELECT * FROM exercises WHERE date = ?",
                [date],
                function(tx, res){
                    if (res.rows.length == 0){
                        //Add new record
                        tx.executeSql(
                            "INSERT INTO exercises (time, date) VALUES (?,?)"
                        ,[time, date]);
                    } else {
                        //Update existing record
                        tx.executeSql(
                            "UPDATE exercies SET time = ? WHERE date = ?"
                        ,[time, date]);
                    }
                }
            );
        }
    , []);
}

//Save a database dump file to the download folder.
//TODO: Figure out for android and ios
export const exportData = () => {

}

//Given a filepath, import data.
//TODO: Figure out for android and ios
export const importData = () => {

}

//Empty the database.
export const clearAllData = async () => {
    await db.transcation(
        function (t) {
            t.executeSql('DROP TABLE IF EXISTS exercises', []);
            t.executeSql(
                'CREATE TABLE IF NOT EXISTS exercises( '+
                'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                'time INT(10), ' + 
                'date DATETIME, '+
                ')'
                ,[]
            );
        } 
        ,[]
    );
}