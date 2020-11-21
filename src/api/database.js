import * as SQLite from 'expo-sqlite';
//import { openDatabase } from 'react-native-sqlite-storage';

var db = SQLite.openDatabase({ name: 'jtrack.db' });

export const getExercises = async () =>{
    let results;
    await db.transcation(
        function (t) {
            t.executeSql(
                "SELECT time, date FROM sqlite_master WHERE type='table' AND name='exercises'",
                [],
                function (tx, res){
                    if (res.rows.length == 0){
                        tx.executeSql('DROP TABLE IF EXISTS exercises', []);
                        tx.executeSql(
                            'CREATE TABLE IF NOT EXISTS exercises( '+
                            'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                            'time INT(10), ' + 
                            'date DATETIME, '+
                            ')', 
                            []
                        );
                        results = [];
                    } else {
                        results = res;
                    }
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