//Convert SQL datetime to JS Date object
export const SQLDateToJSDate = (sqldate) => {
    const t = sqldate.split(/[- :]/);
    const d = new Date(t[0], t[1]-1, t[2], 0, 0);
    return d;
};

//Helper function to add 0 min to days where exercises are not recorded yet.
//TODO - make part of SQL query
export const fillEmptyGraphData = (graphData, startDate) => {
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

//Helper function to get number of days in the month.
function getDaysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
};

//Helper function to convert SQL dataset into graph dataset.
export const convertToGraphObject = (results, startDate) => {
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

//Helper function that converts SQL dataset into calendar dataset.
export const convertToCalendarObject = (results) => {
    const calendarObject = {};
    results.map((item)=>{
        let date = item.date.slice(0, -9);
        calendarObject[date] = {marked: true, minutes: item.time};
    }); 
    return calendarObject;
}

//Helper function for putting result set into an array.
export const resultsIntoArray = (res) => {
    const resultsArray = [];
    for(let i = 0; i < res.rows.length; i++){
        resultsArray.push({...res.rows.item(i)});
    }
    return resultsArray;
}


//Helper function to convert a Javascript DateTime object to a SQL DATETIME string.
export const dateTimeToSQLString = (date) => {
    const pad = function(num) { return ('00'+num).slice(-2) };
    return date.getUTCFullYear() + '-' + 
        pad(date.getUTCMonth() + 1) + '-' + 
        pad(date.getUTCDate()) + " 00:00:00";
}