
    // get attributes submitted by the user from previous page
    var username = sessionStorage.getItem('username');
    var namespace = sessionStorage.getItem('ns');
    var method = sessionStorage.getItem('method');
    sessionStorage.clear();

    // Authorizer Token (set if this client is authorizer)
    var authToken = null;
    var PassCode;           // User pass code for verification at server

    var TOKENS = 0;         // total token count of this client
    var CARDS = [];         // cards of this client
    var allPlayers = [];
    const MINPLAYERS = 3;

    // open a connection
    var socket = io(namespace);

    // take action based on the required method
    if(method == 'createNamespace'){
        if(username){
            socket.emit('createNameSpace');
            socket.emit('addUser', username);
        }
    }
    else if(method == 'joinNamespace'){
        // joinNamespace(namespace, username);
        if(username && namespace){
            socket.emit('addUser', username);
        }
    }


    // ...SERVER CALLBACK FUNCTIONS...
    socket.on('newUserAdded', (userList) => {
        allPlayers = userList;

        docAddPlayerPlayersView(userList);

        // var userselem = document.getElementById('users');
        // userselem.innerHTML = '';

        // for(var i = 0; i<userList.length; i++){
        //     var text = document.createElement('li');
        //     text.textContent = userList[i];
        //     userselem.appendChild(text);
        //     window.scrollTo(0, document.body.scrollHeight);
        // }
    });

    socket.on('setPassCode', (pscode) => {
        PassCode = pscode;
    })

    socket.on('authoriser', (authtoken) => {
        // you are an authorizer
        authToken = authtoken;
        // Draw the startGame button (only in authoriser client)
        // var startButtonDiv = document.getElementById('startButtonDiv');
        // var buttonElem = document.createElement('button');
        // buttonElem.addEventListener('click', function(){
        //     socket.emit('startGame', authToken);
        // })
        // buttonElem.style.height = '100px';
        // buttonElem.style.width = '100px';
        // startButtonDiv.appendChild(buttonElem);

        var startButtonDiv = document.getElementById('startButtonDiv');
        startButtonDiv.style.visibility = 'visible';
        startButtonDiv.addEventListener('click', function(){
            // handle only if current players count is above the minimum players required
            if(allPlayers.length >= MINPLAYERS){
                socket.emit('startGame', authToken);
            }
        })

    });

    socket.on('enableStartButton', () => {
        console.log('enable Start Button !!!')
        var btn = document.getElementById('startButtonDiv');
        btn.style.backgroundColor = '#a63ec5';
        btn.style.color = 'black';
    });

    socket.on('gameStarted', () => {
    // Clear screen and draw the game view
        var players = document.getElementById('players');
        var playersCircle = document.getElementById('playersCircle');
        var gameView = document.getElementById('gameView');

        document.getElementById('startButtonDiv').style.visibility = 'hidden';
        document.getElementById('startButtonDiv').style.width = '0px';
        players.style.visibility = 'hidden';
        playersCircle.style.visibility = 'hidden';
        players.style.height = '0px';
        gameView.style.visibility = 'visible';
        document.getElementsByTagName('body')[0].style.overflowY = 'visible';
        document.getElementsByTagName('body')[0].style.overflowX = 'hidden';
        document.getElementsByTagName('body')[0].style.backgroundColor= 'cornflowerblue';

        // set username in the UI
        docSetUserName(username);

        // add user card Tables
        for(var i=0; i<allPlayers.length; i++){
            addNewCardTable(allPlayers[i]);
        }
    })

    socket.on('connectionRefused', function(){
    // No more space in the current namespace
        console.log("connection Refused");

        // go back to the starting page
        window.alert('Current Namespace is full :( ');
        window.location.href = '/';
    });

    socket.on('LoggedOut', () => {
    // One or more users logged out!! Notify and end the game
        console.log('A User Logged Out');
        window.alert('Someone Logged Out :( ');
        window.location.href = '/';
    })

    socket.on('namespaceError', function(){
    // error related namespace..cant be created
        console.log('namespace already exists!!!');
    });

    socket.on('usernameError', function(){
    // error related to username...cant be created
        console.log('Username already exists!!!');
    });


    // ##### GAME VIEW #####

    function takeCard(){
        socket.emit('takecard', {'name': username, 'passCode': PassCode});
    }

    function passCard(){
        socket.emit('passcard', {'name': username, 'passCode': PassCode});
    }

    socket.on('tookcard', (arg) => {
        console.log(arg);
        // arg.player
        // arg.cards
        docSetCardNo(arg.nextCard );
        docSetCurrUser(arg.nextPlayer);
        docSetCardToken(0);

        // update corresponding card table of the user
        addCard(arg.player, arg.cards);
    })

    socket.on('passedcard', (arg) => {
        console.log(arg);
        docSetCardNo(arg.card);
        docSetCardToken(arg.tokens);
        docSetCurrUser(arg.nextPlayer);
    })

    socket.on('updateToken', (token) => {
    // update token count of this client
        TOKENS = token;
        docSetToken(TOKENS);
        // var tokenCount = document.getElementById('tokenCount');
        // tokenCount.textContent = '> ' + TOKENS;
    })

    socket.on('updateScore', (score) => {
        docSetScore(score);
    })
        // <p>Players</p>
        // <p id="playercards"></p>
        // <p>Tokens</p>
        // <p id="tokenCount"></p>
        // <p>Current Card</p>
        // <p id="currCard"></p>

    
    socket.on('updatePlayerCards', (arg) =>{
        // console.log('player: ' + arg.player + 'cards: ' + arg.cards);
        var playercards = document.getElementById('playercards');
        playercards.textContent += 'player: ' + arg.player + 'cards: ' + arg.cards + '\n';
    })

    socket.on('nextCard', (arg) => {
        var player = arg.player;
        var card  = arg.card;
        docSetCardNo(card);
        docSetCurrUser(player);
        // var currCard = document.getElementById('currCard');
        // currCard.textContent = 'player: ' + player + 'card: ' + card;
    });

    socket.on('endGame', (ScoreList) => {
        // TODO: handle properly
        console.log(ScoreList);
    });
