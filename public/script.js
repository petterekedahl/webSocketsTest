"use strict";
let user = { "user": ''};

const socket = new WebSocket("ws://localhost:1337");

socket.addEventListener('open', event => {
    console.log("You are connected")
})

socket.addEventListener('message', event => {
    let data = JSON.parse(event.data);
    let peopleOnline = [];

    if(data.loggedInGuest != undefined && data.oldMessages != undefined) {
        user.user = data.loggedInGuest;

        let input = document.getElementById('newMessage');
        input.setAttribute('placeholder', user.user);

        data = data.oldMessages;

        data.messages.forEach(message => {
            let createMessage = new CreateMessageDiv({
                "date": message.date,
                "user": message.user,
                "message": message.message
            })
    
            let chatScreen = document.querySelector('#chatRoom');
            chatScreen.append(createMessage.createMessage()); 
        })
    }
    if(data.peopleOnline != undefined && data.newConnection != undefined) {
        peopleOnline = data.peopleOnline;
        let chatScreen = document.querySelector('#chatRoom');
        let p = document.createElement('p');
        p.innerHTML = `${data.newConnection} just joined the room.`
        chatScreen.append(p);
        addOnlinePeeps(data.peopleOnline);   
    }

    if(data.peopleOnline != undefined && data.disconnectedUser != undefined) {
        peopleOnline = data.peopleOnline;
        let chatScreen = document.querySelector('#chatRoom');
        let p = document.createElement('p');
        p.innerHTML = `${data.disconnectedUser} just left the room.`
        chatScreen.append(p);
        addOnlinePeeps(data.peopleOnline);
    }


    if (data.user != undefined && data.message != undefined) {
        let createMessage = new CreateMessageDiv({
            "date": data.date,
            "user": data.user,
            "message": data.message
        })
        let chatScreen = document.querySelector('#chatRoom');
        chatScreen.append(createMessage.createMessage()); 
    }
})

//Functions
function sendMessage(guestUser, message) {
    let messageObj = {
        "user": guestUser,
        "message": message
    }

    socket.send(JSON.stringify(messageObj));
}

function addOnlinePeeps(data) {
    let onlineDiv = document.getElementById('peopleOnline');
        onlineDiv.innerHTML = '';
        data.forEach(user => {
            let onlineUser = new PeopleOnline({
                user
            })
            onlineDiv.append(onlineUser.addPeopleOnline());
        })
        let h3 = document.createElement('h3');
        h3.innerHTML = `There are ${data.length} people online.`;

        onlineDiv.prepend(h3);
}

//EventListeners
let sendButt = document.getElementById('sendMessage');
sendButt.addEventListener('click', function(event) {
    // if (event.code == 13) {
        let message = document.querySelector('#newMessage').value;
        let input = document.getElementById('newMessage');
        input.value = '';

        sendMessage(user.user, message);
        sendButt.style.backgroundColor = 'gainsboro';
        sendButt.setAttribute('disabled', 'disabled');
    // }
})

let inRoom = document.getElementById('inRoom');
inRoom.addEventListener('click', () => {
    let onlineDiv = document.querySelector('#peopleOnline');

    if(onlineDiv.style.height == "" ||onlineDiv.style.height == "0px") {
        onlineDiv.style.display = "flex";
        onlineDiv.style.top = "17%";
        onlineDiv.style.left = "5%";
        onlineDiv.style.height = "600px";
        onlineDiv.style.width = "300px";
        onlineDiv.style.padding = "20px";
        onlineDiv.style.overflowY = "scroll";

    } else {
        onlineDiv.style.display = "flex";
        onlineDiv.style.top = "17%";
        onlineDiv.style.left = "40%";
        onlineDiv.style.height = "0";
        onlineDiv.style.width = "0";
        onlineDiv.style.padding = "0px";
        onlineDiv.style.overflow = "hidden";
    }
})

let messageInput = document.querySelector('#newMessage');
messageInput.addEventListener("input", () => {

    if(messageInput.value == '') {
        sendButt.style.backgroundColor = 'gainsboro'
        sendButt.classList.remove('buttonHover');
        sendButt.setAttribute('disabled', 'disabled');
    }else {
        sendButt.style.backgroundColor = 'rgb(14, 122, 254)';
        sendButt.classList.add('buttonHover');
        sendButt.removeAttribute('disabled');
    }
})

messageInput.value = '';

//Classes
class CreateMessageDiv {
    constructor(data) {
        this.date = data.date;
        this.user = data.user;
        this.message = data.message;
    };

    createMessage() {

        let messageBox = document.createElement('div');
        let timeDiv = document.createElement('div');
        let userDiv = document.createElement('div');
        let messageDiv = document.createElement('div');

        timeDiv.classList.add('timeDiv');

        timeDiv.innerHTML =  this.date;
        userDiv.innerHTML = this.user + ": ";

        if(this.user == user.user) {
            userDiv.innerHTML = "You: ";
            messageBox.style.backgroundColor = "rgb(14, 122, 254)";
        }

        messageDiv.innerHTML = this.message;
        messageBox.classList.add('messageBox');

        messageBox.append(timeDiv, userDiv, messageDiv);

        messageBox.addEventListener('click', () => {
            timeDiv.classList.toggle('timeDiv');
        })

        return messageBox;
    }
}

class PeopleOnline {
    constructor(data) {
        this.user = data.user;
    }

    addPeopleOnline() {
        let personDiv = document.createElement('div');
        let onlineCircle = document.createElement('div');
        let personName = document.createElement('div');

        personName.innerHTML = this.user;
        onlineCircle.classList.add('greenOnline');
        personDiv.append(onlineCircle, personName);

        return personDiv;
    }
}

