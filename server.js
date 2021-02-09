const express = require('express');
const app = express();
const WebSocket = require('ws');

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Server is listening");
});

const wsServer = new WebSocket.Server({ port: 1337 });

let peopleOnline = [];

wsServer.on('connection', (websocket) => {

    //Ge nickname och skicka tillbaks till clienten
    let name = nameGenerator();
    peopleOnline = [...peopleOnline, name];

    let userObj = {
        peopleOnline,
        name
    };
    websocket.send(JSON.stringify(userObj));

    websocket.on('message', (message) => {
        broadcastAll(wsServer, message);
    });
    websocket.on('close', () => {
        console.log('Someone has disconnected')
    });
});

wsServer.on('listening', () => {
    console.log("WebSocket server is listening to localhost:1337")
})

function broadcastAll(server, message) {
    server.clients.forEach(client => {
        if(client.readyState === Websocket.OPEN) {
            client.send(message);
        }
    });
}