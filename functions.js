function updateDatabase(data) {

}

function getDatabase() {

}

function nameGenerator(peopleOnline) {
    let name = "guest#" + rN(1000);

    peopleOnline = { ...peopleOnline, name};

    return name;
}

function rN(max) {
    return Math.floor(Math.random() * Math.floor(max));
}