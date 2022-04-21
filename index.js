
// TODO:

// * check no of players joined and enable start button
// * logic for ending game
// * keep track of players scores
// * handle if one or more clients gets disconnected after connecting
// * clear memory if workspaces are ideal or not required
// check for false return conditions from the gameLib class(errors)
// * polish the UI(Color Scheme and stuff)
// * sharing NameSpaces with other users(popup and message)


const express = require('express');
const app = express();
const http = require('http');
const { SocketAddress } = require('net');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server);

// the Game class...
const Game = require('./gameLib').Game;
const game = new Game();

authToken = {};

// *** STATIC FILES *** //
app.use(express.static(__dirname));


// *** SERVER ROUTES *** //
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/new', (req, res) => {
    res.sendFile(__dirname + '/p1.html');
});

app.get('/index', (req, res)=> {
    res.sendFile(__dirname + '/index1.html');
});

app.get('/gameView', (req, res) => {
    // temporary route for testing frontend
    // res.sendFile(__dirname + '/gameView.html');
    res.sendFile(__dirname + '/p1.html');
});

// app.get('/qstr', (req, res) => {
//     console.log(req.query);
//     res.send('id: ' + req.query.id);
// })

// CONSTANT NEED TO BE CONFIGURED
const MINPLAYERCOUNT = 3;
const MAXCLIENTCOUNT = 7;

io.of(/^\/dynamic-\d+$/).on('connection', (socket) => {

    // current namespace
    const NSOBJ = socket.nsp;
    const NAMESPACE = NSOBJ.name;

    // check if game already initialized
    // if(game.gameStarted(NAMESPACE)){
    //     console.log('Game Already Started');
    //     socket.disconnect();
    //     return;
    // }

    // check if max player count is being exceded
    var usercount = game.getUserCount(NAMESPACE);
    if(++usercount > MAXCLIENTCOUNT){
        console.log('no Space !!!');
        socket.emit('connectionRefused');
        socket.disconnect();
        return;
    }

    console.log('a user logged with namespace: ' + NAMESPACE);

    socket.on('disconnect', () => {
    // client disconnect handler
    // clear mem of the namespace and end the game
        if(game.PlayerInNamespace(NAMESPACE, socket.id)){
            console.log('A user logged out...');
            game.delNameSpace(NAMESPACE);
            io.of(NAMESPACE).emit('LoggedOut');
        }
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
        var usrPsCode = game.addUser(NAMESPACE, username, socket.id);
        if( ! usrPsCode){
            console.log('userAlready Exists!!');
            socket.emit('usernameError', NAMESPACE);
            socket.disconnect();
            return;
        }

        console.log('User Created: ' + username);
        // return the list of players in current namespace
        socket.emit('setPassCode', usrPsCode);
        io.of(NAMESPACE).emit('newUserAdded', game.getAllUsers(NAMESPACE));
        console.log('All users: ' + game.getAllUsers(NAMESPACE))

        if(game.getUserCount(NAMESPACE) >= MINPLAYERCOUNT){
            console.log('Min players available')
            // enable the start game button
            io.of(NAMESPACE).emit('enableStartButton');
        }
    });


    socket.on('startGame', (authtoken) => {
        if(game.getUserCount(NAMESPACE) >= MINPLAYERCOUNT && authToken[NAMESPACE] == authtoken){
            console.log('GAME INITIALISED');
            var tokenCount = game.initialise(NAMESPACE);
            // update the tokenCount for each client
            io.of(NAMESPACE).emit('updateToken', tokenCount);
            // initial Score
            io.of(NAMESPACE).emit('updateScore', -tokenCount);
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
            'cards': newstatus.cards.sort((a,b) => {return a-b}),
            // 'tokens': newstatus.tokens,
            'nextCard': nextcard ? nextcard : 0,    // if card is undefined send 0
            'nextPlayer': currstatus.currPlayer
        });

        socket.emit('updateToken', newstatus.tokens);
        
        socket.emit('updateScore', game.getScoreOfUser(NAMESPACE, user.name));

        // Game End Logic
        if(nextcard === undefined){
            var scoresList = game.getScores(NAMESPACE);
            io.of(NAMESPACE).emit('endGame', scoresList);
            return;
        }
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

        socket.emit('updateScore', game.getScoreOfUser(NAMESPACE, user.name));
    })
    
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`listening on port ${port}...`);
});