const express = require('express');
const app = express();
const websocket = require('ws');

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("Server is listening");
})

const wsServer = new WebSocket.Server({ port: 1337 });

wsServer.on('connection', (websocket) => {
    websocket.on('message', (message) => {
        
    });
});