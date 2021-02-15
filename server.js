const express = require('express');
const app = express();
const WebSocket = require('ws');
const functions = require("./functions.js");

let peopleOnline = [];

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Server is listening");
});

const wsServer = new WebSocket.Server({ port: 1337 });

wsServer.on('connection', (websocket) => {

    //Ge nickname och skicka tillbaks till clienten
    let name = functions.nameGenerator();
    peopleOnline.forEach(userNames => {
        if(userNames == name) {
            name = functions.nameGenerator();
        }
    })
    peopleOnline = [...peopleOnline, name];

    let database = functions.getDatabase();

    let userName = {
        "loggedInGuest": name,
        "oldMessages": database
    };

    websocket.send(JSON.stringify(userName));
    
    broadcastAll(wsServer, { "peopleOnline": peopleOnline, "newConnection": name });

    websocket.on('message', (message) => {
        message = JSON.parse(message);
        let date = functions.getDate();
        //här
        date = date.date
        message = {...message, date}

        functions.updateDatabase(message, (err) => {
            if(err) {
                websocket.send(JSON.stringify({"error": "Database could not updage"}))
                return;
            } else {
                return;
            }
        });
        broadcastAll(wsServer, message);
    });
    websocket.on('close', () => {

        let index = peopleOnline.indexOf(name);
        peopleOnline.splice(index, 1);
        broadcastAll(wsServer, { "peopleOnline": peopleOnline, "disconnectedUser": name });
    });
});

wsServer.on('listening', () => {
    console.log("WebSocket server is listening to localhost:1337")
})

function broadcastAll(server, message) {
    server.clients.forEach(client => {
        if(client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}