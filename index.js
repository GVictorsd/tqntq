const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// the Game class...
const Game = require('./gameLib').Game;
const game = new Game();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/p1.html');
// });
app.get('/new', (req, res) => {
    res.sendFile(__dirname + '/p1.html');
});

app.get('/clint2', (req, res)=> {
    res.sendFile(__dirname + '/p2.html');
});

// io.on('connection', (socket) => {
//     console.log('main connected');
//     socket.
// })

var clientCount = 0;
var maxClientCount = 100;

io.of(/^\/dynamic-\d+$/).on('connection', (socket) => {
    if(++clientCount > maxClientCount){
        clientCount--;
        console.log('no space!!!');
        socket.emit('connectionRefused', "sorry no space");
        socket.disconnect();
        return;
    }

    const NAMESPACE = socket.nsp;
    console.log('a user logged with namespace: ' + NAMESPACE.name);

    socket.on('disconnect', () => {
        console.log('disconnected');
    });

    // socket.on('first:chat message', (msg) => {
    //     console.log('message: ' + msg);
    //     io.of(namespace.name).emit('chat message', msg);
    //     // socket.emit('chat message', msg);
    // });

    socket.on('createNameSpace', (name) => {
        if( ! game.addNameSpace(name) ){
            console.log('namespace exists');
            socket.emit('namespaceError');
            return;
        }
        console.log('New Namespace created: ' + name);
    });


    socket.on('addUser', (arg) => {
        var nameSpace = arg.ns;
        var username = arg.username;
        if( ! game.addUser(nameSpace, username)){
            console.log('userAlready Exists!!');
            socket.emit('usernameError');
            return;
        }
            // try{
            //     // if players field exists for this namespace then update list
            //     if(data[namespace.name].players){
            //         data[namespace.name].players.push(name);
            //     }
            // } catch {
            //     // else create the field and update the list of players
            //     data[namespace.name] = {};
            //     data[namespace.name].players = [name];
            // }
        // return the list of players in current namespace
        console.log('User Created: ' + username);
        // io.of(namespace.name).emit('playersList', data[namespace.name]);
        io.of(NAMESPACE.name).emit('playersList', game.getAllUsers(nameSpace));
        console.log('All users: ' + game.getAllUsers(nameSpace))
    });
});

server.listen(3000, () => {
    console.log('listening on port 3000');
});