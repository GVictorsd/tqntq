const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/p1.html');
});

app.get('/clint2', (req, res)=> {
    res.sendFile(__dirname + '/p2.html');
});

// io.on('connection', (socket) => {
//     console.log('main connected');
//     socket.
// })

var data= {};

io.of(/^\/dynamic-\d+$/).on('connection', (socket) => {
    console.log('a user logged in');
    const namespace = socket.nsp;
    socket.on('disconnect', () => {
        console.log('disconnected');
    });
    socket.on('first:chat message', (msg) => {
        console.log('message: ' + msg);
        io.of(namespace.name).emit('chat message', msg);
        // socket.emit('chat message', msg);
    });
    socket.on('createUser', (name) => {
        console.log('User Created: ' + name);
        try{
            // if players field exists for this namespace then update list
            if(data[namespace.name].players){
                data[namespace.name].players.push(name);
            }
        } catch {
            // else create the field and update the list of players
            data[namespace.name] = {};
            data[namespace.name].players = [name];
        }
        // return the list of players
        io.of(namespace.name).emit('playersList', data[namespace.name]);
        console.log(data);
    });
});

server.listen(3000, () => {
    console.log('listening on port 3000');
});