export const getTodayDate = () => {
    var date = new Date(); 
    var todaydate = date.getFullYear();
    todaydate += "-" + ("0" + (date.getMonth() + 1)).slice(-2);
    todaydate += "-" + ("0" + date.getDate()).slice(-2);
    return todaydate;
}