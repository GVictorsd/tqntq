
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
        document.getElementById('namespaceurl').style.visibility = 'hidden';
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
        window.alert("Can't join the playground :( \n Looks like this playground is full");
        window.location.href = '/';
    });

    socket.on('LoggedOut', () => {
    // One or more users logged out!! Notify and end the game
        console.log('A User Logged Out');
        window.alert('Oops! Looks like someone Logged Out :( ');
        window.location.href = '/';
    })

    socket.on('namespaceError', function(){
    // error related namespace..cant be created
        window.alert('Error creating the playground :(');
        console.log('namespace already exists!!!');
        window.location.href = '/';
    });

    socket.on('usernameError', (namespace) => {
    // error related to username...cant be created
        window.alert('Looks like your User Name is already being used \n Or this game has already started\n Try using a different user name');
        console.log('Username already exists!!!');
        console.log('/?ns=/' + namespace);
        // set the namespace field if available
        if(namespace){
            window.location.href = '/?ns=' + namespace;
        }else{
            window.location.href = '/';
        }
    });


    // ##### GAME VIEW #####

    function takeCard(){
        socket.emit('takecard', {'name': username, 'passCode': PassCode});
    }

    function passCard(){
        if(TOKENS == 0){
            document.alert('Got no sufficient tokens :(');
            return;
        }
        socket.emit('passcard', {'name': username, 'passCode': PassCode});
    }

    function takePassState(activate) {
        var active = '#f26ca7';
        var inactive = 'gray';

        var passbtn = document.getElementById('pass-button');
        var takebtn = document.getElementById('take-button');

        passbtn.style.backgroundColor = activate ? active : inactive;
        takebtn.style.backgroundColor = activate ? active : inactive;
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
        takePassState(arg.nextPlayer == username);
    })

    socket.on('passedcard', (arg) => {
        console.log(arg);
        docSetCardNo(arg.card);
        docSetCardToken(arg.tokens);
        docSetCurrUser(arg.nextPlayer);

        takePassState(arg.nextPlayer == username);
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

        // initialize colors of the take and pass buttons
        takePassState(player == username);
    });

    socket.on('endGame', (ScoreList) => {
        // TODO: handle properly
        var res = ScoreList.sort((a, b) => {
            return a[1] - b[1];
        })
        var scores = 'Congrats!! ' + res[0][0] + '\n' + 'Scores:\n';
        for(var i = 0; i<res.length; i++){
            scores += i+1 + '.  ' + res[i][0] + ' :  ' + res[i][1] + '\n';
        }
        window.alert(scores);
        window.location.href = '/';
    });
