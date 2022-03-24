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

    socket.on('addUser', (username) => {
        // add new user to namespace in the game object
        var usrPsCode = game.addUser(NAMESPACE, username);
        if( ! usrPsCode){
            console.log('userAlready Exists!!');
            socket.emit('usernameError');
            return;
        }

        console.log('User Created: ' + username);
        // return the list of players in current namespace
        socket.emit('setPassCode', usrPsCode);
        io.of(NAMESPACE).emit('newUserAdded', game.getAllUsers(NAMESPACE));
        console.log('All users: ' + game.getAllUsers(NAMESPACE))
    });


    socket.on('startGame', (authtoken) => {
        if(game.getUserCount(NAMESPACE) >= MINPLAYERCOUNT && authToken[NAMESPACE] == authtoken){
            console.log('GAME INITIALISED');
            var tokenCount = game.initialise(NAMESPACE);
            // update the tokenCount for each client
            io.of(NAMESPACE).emit('updateToken', tokenCount);
            // game started! redraw the screen to set GameView
            io.of(NAMESPACE).emit('gameStarted');

            // update players and their cards
            var allUsers = game.getAllUsers(NAMESPACE);
            for(var i=0; i<game.getUserCount(NAMESPACE); i++){
                var arg = {};
                arg.player = allUsers[i];
                arg.cards = game.getUser(NAMESPACE, allUsers[i]);
                console.log('player: ' + arg.player + 'Cards: ' + arg.cards);
                io.of(NAMESPACE).emit('updatePlayerCards', arg);
            }

            // update next card and current player
            var arg = {};
            arg.card = game.getNextCard(NAMESPACE);
            arg.player = game.getNextPlayer(NAMESPACE);
            currPlayer = arg.player;
            currCard = arg.card;
            io.of(NAMESPACE).emit('nextCard', arg);
        }
    })

    // TODO: socket.on('take', (user)) .. on('pass')
    socket.on('takecard', (user) => {
        // user.name;
        // user.passCode;
        if(!game.validateUser(NAMESPACE, user.name, user.passCode)){
            console.log('invalid passcode or operation');
            return;
        }
        var currstatus = game.getCurrStatus(NAMESPACE);
        var newstatus = game.addCard(NAMESPACE, currstatus.currPlayer, currstatus.currCard, currstatus.currTokens);

        var nextcard = game.getNextCard(NAMESPACE);

        io.of(NAMESPACE).emit('tookcard', {
            'player': currstatus.currPlayer, 
            'card': newstatus.cards.sort(),
            // 'tokens': newstatus.tokens,
            'nextCard': nextcard,
            'nextPlayer': currstatus.currPlayer
        });

        socket.emit('updateToken', newstatus.tokens);
    })

    socket.on('passcard', (user) => {
        if(!game.validateUser(NAMESPACE, user.name, user.passCode)){
            console.log('invalid passcode or operation');
            return;
        }
        var currstatus = game.getCurrStatus(NAMESPACE);
        var nextPlayer = game.getNextPlayer(NAMESPACE);
        var playerTokens = game.useToken(NAMESPACE, currstatus.currPlayer);
        if(!playerTokens){
            socket.emit('noTokens');
            return;
        }
        io.of(NAMESPACE).emit('passedcard', {
            'passedPlayer': currstatus.currPlayer,
            'nextPlayer': nextPlayer,
            'tokens': game.getCurrStatus(NAMESPACE).currTokens,
            'card': currstatus.currCard
        });
        socket.emit('updateToken', playerTokens);
    })
    
});

server.listen(3000, () => {
    console.log('listening on port 3000...');
});