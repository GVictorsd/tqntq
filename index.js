const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// the Game class...
const Game = require('./gameLib').Game;
const game = new Game();

authToken = {};


// *** SERVER ROUTES *** //

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/new', (req, res) => {
    res.sendFile(__dirname + '/p1.html');
});

app.get('/clint2', (req, res)=> {
    res.sendFile(__dirname + '/p2.html');
});

// CONSTANT NEED TO BE CONFIGURED
const MINPLAYERCOUNT = 1;

io.of(/^\/dynamic-\d+$/).on('connection', (socket) => {
    // TODO:: NEED TO IMPLEMENT
    // if(++CLIENTCOUNT > MAXCLIENTCOUNT){
    //     CLIENTCOUNT--;
    //     console.log('no space!!!');
    //     socket.emit('connectionRefused', "sorry no space");
    //     socket.disconnect();
    //     return;
    // }

    // current namespace
    const NSOBJ = socket.nsp;
    const NAMESPACE = NSOBJ.name;

    console.log('a user logged with namespace: ' + NAMESPACE);

    socket.on('disconnect', () => {
    // client disconnect handler
        console.log('disconnected');
    });

    socket.on('createNameSpace', () => {
    // create new namespace as a game object state
        if( ! game.addNameSpace(NAMESPACE) ){
            console.log('namespace exists');
            socket.emit('namespaceError');
            return;
        }

        var authoriserToken = parseInt(Math.random()*Date.now());
        socket.emit('authoriser', authoriserToken);
        authToken[NAMESPACE] = authoriserToken;

        console.log('New Namespace created: ' + NAMESPACE);
    });

    socket.on('startGame', (authtoken) => {
        if(game.getUserCount(NAMESPACE) >= MINPLAYERCOUNT && authToken[NAMESPACE] == authtoken){
            console.log('GAME INITIALISED');
            /////
            ///
            // *** GAME LOGIC ***
        }
    })


    socket.on('addUser', (username) => {
        // add new user to namespace in the game object
        if( ! game.addUser(NAMESPACE, username)){
            console.log('userAlready Exists!!');
            socket.emit('usernameError');
            return;
        }

        console.log('User Created: ' + username);
        // return the list of players in current namespace
        io.of(NAMESPACE).emit('newUserAdded', game.getAllUsers(NAMESPACE));
        console.log('All users: ' + game.getAllUsers(NAMESPACE))
    });
    
});

server.listen(3000, () => {
    console.log('listening on port 3000...');
});