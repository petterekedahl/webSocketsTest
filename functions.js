const fs = require('fs');
let database = require('./database.json');

function updateDatabase(message, callback) {
    database.messages.push(message);

    fs.writeFile("./database.json", JSON.stringify(database), callback);
}

function getDatabase() {
    return database;
}

function nameGenerator(peopleOnline) {
    let name = "guest#" + rN(9999);

    peopleOnline = { ...peopleOnline, name};

    return name;
}

function rN(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function getDate() {
    let dateNow = new Date();
    let date =  {date: dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds()};

    return date;
}

module.exports = {
    updateDatabase,
    getDatabase,
    nameGenerator,
    getDate
}