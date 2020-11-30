import * as SQLite from 'expo-sqlite';
import testTableInserts from '../testTableInserts';

export const setupDatabase = async () => {

    const db = SQLite.openDatabase({ name: 'jtrack.db' });

    try{
        console.log('before transaction');
        console.log(db.transaction);
        db.transcation(
            tx => {
                console.log('tx:', tx);
                console.log('transaction started...');
                //Clear old data.
                tx.executeSql('DROP TABLE IF EXISTS exercises', []);
                //Create new database.
                tx.executeSql(
                    'CREATE TABLE IF NOT EXISTS exercises( '+
                    'id INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    'time INT(10), ' + 
                    'date DATETIME, '+
                    ')', 
                    []
                );
                //Test data for exercise table.
                tx.executeSql( testTableInserts );
            }
        );
    } catch (err) {
        console.log('dbsetup error:', err);
        return 'db.transaction failed';
    }
};

export const fetchExercises = async (startDate) => {

    const db = SQLite.openDatabase({ name: 'jtrack.db' });
    let results;

    //Ensures starting data for selection is first day of month.
    startDate.setDate(1);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth()+1, 0);
    const startDateStr = dateTimeToSQLString(startDate);
    const endDateStr = dateTimeToSQLString(endDate);

    try {
        await db.transcation(
            function (t) {
                t.executeSql(
                    "SELECT time, date FROM sqlite_master WHERE type='table' AND name='exercises' WHERE date >= ? AND date <= ?",
                    [startDateStr, endDateStr],
                    function (tx, res){
                        results = res.rows;
                    }
                );
            }
        , []);
        return results;
    } catch (err){
        return 'db.transaction failed.';
    }
};

//Records new time and date for exercise.
export const saveExercise = async (time, date) => {

    const results = [];
    const db = SQLite.openDatabase({ name: 'jtrack.db' });
    const sqlDate = dateTimeToSQLString(date);

    try {
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
                            ,[time, sqlDate]);
                        } else {
                            //Update existing record
                            tx.executeSql(
                                "UPDATE exercises SET time = ? WHERE date = ?"
                            ,[time, sqlDate]);
                        }
                        results = fetchExercises(date);
                    }
                );
            }
        ,[]);
        return results;
    } catch (err) {
        return 'db.transaction failed.';
    }
};

//Helper function to convert a Javascript DateTime object to a SQL DATETIME string.
const dateTimeToSQLString = (date) => {
    const pad = function(num) { return ('00'+num).slice(-2) };
    return date.getUTCFullYear() + '-' + 
        pad(date.getUTCMonth() + 1) + '-' + 
        pad(date.getUTCDate()) + " 00:00:00";
};

