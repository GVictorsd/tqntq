
class Game {
    constructor() {
        // global state data of all the users and namespaces
        this.data = {};
    }
    // data structure (this.data)
    // data: {
    //     ns1: {players: {usr1: {...}, usr2: {}},
                        // me: {cards:[], currCard = <int>, currPlayer=<str>, currTokens = <int>},
                        // users: []},
    //     ns2: {players: {..}, me: {cards:[]}, users: []},
    //     ...
    // }
    // players: {
    //     passcode: <int>, cards: [], tokens: <int>
    // }
    
    addNameSpace (namespace) {
        // adds new namespace entry to this.data
        if(this.data[namespace] !== undefined){
            return false;
        }
        this.data[namespace] = {players:{}, me:{}, users:[]};
        return true;
    }
    // TODO: methods to delete namespaces

    addUser(namespace, username) {
        // ADD NEW USER TO GIVEN NAMESPACE
        if(this.data[namespace].players[username] !== undefined){
            return false
        }
        var pscode = parseInt(Math.random()*1e15);
        this.data[namespace].players[username] = {cards:[], tokens:0};
        this.data[namespace].players[username].passcode = pscode;
        this.data[namespace].users.push(username);
        return pscode;
    }

    addCard(namespace, username, card, tokens) {
        var user = this.getUser(namespace, username);
        if(user === undefined){
            return false;
        }
        user.cards.push(card);
        user.cards.sort();
        user.tokens += tokens;
        this.data[namespace].me.currTokens = 0;
        return {'cards': user.cards, 'tokens': user.tokens};
    }

    useToken(namespace, username) {
        var user = this.getUser(namespace, username);
        if(user === undefined){
            return false;
        }
        if(user.tokens > 0){
            this.data[namespace].me.currTokens += 1;
            return --user.tokens;
        }
        else{
            return false;
        }
        // return user.tokens > 0 ? --user.tokens : false;
    }

    initialise(namespace){
        // Once this method is called, stop taking more
        // connections to this namespace

        if(this.getUserCount < 3 || this.getUserCount > 7){
        // if user count out of range
            return false;
        }

        var cardList = [];
        for(var i=3; i<35; i++){
            cardList.push(i);
        }
        cardList = this.__shuffle(cardList);
        for(var i=0; i<9; i++){
            cardList.splice(Math.floor(Math.random()*cardList.length), 1);
        }

        this.data[namespace].me.cards = cardList;

        var players = this.data[namespace].users;
        var playerCount = players.length;
        var NoCounters;

        if(playerCount>=3 && playerCount <=5){
            NoCounters = 11;
        }else if(playerCount == 6){
            NoCounters = 9;
        }else if(playerCount == 7){
            NoCounters = 7;
        }else{
            // number of players not in range
            return false;
        }

        for(var i=0; i<playerCount; i++){
            this.data[namespace].players[players[i]].tokens = NoCounters;
        }


        return NoCounters;
    }

    validateUser(namespace, username, passcode){
        var userPsCode;
        var currPlayerPasscode;
        var curPlayer = this.getCurrStatus(namespace).currPlayer;
        try{
            userPsCode = this.data[namespace].players[username].passcode;
            currPlayerPasscode = this.data[namespace].players[curPlayer].passcode;
        }catch{
            return false;
        }

        if(currPlayerPasscode == passcode && userPsCode == passcode){
        // if the supplied passcode belongs to current player
        // and and username and passcode match...
            return true;
        }
        return false;
        // return userPsCode == passcode ? true : false;
    }

    getAllUsers(namespace){
        // return all users of a namespace
        return this.getNameSpace(namespace).users;
    }

    getUserCount(namespace){
        // return current count of users in the namespace
        return this.getNameSpace(namespace).users.length;
    }

    getNextCard(namespace){
        // set current card being played as a state and return it
        this.data[namespace].me.currCard = this.data[namespace].me.cards.pop();
        this.data[namespace].me.currTokens = 0;
        return this.data[namespace].me.currCard;
    }
    getNextPlayer(namespace){
        // set currplayer in the state and return the player
        var nextplayer = this.data[namespace].users[0];
        this.data[namespace].users.push(this.data[namespace].users.shift(1));
        this.data[namespace].me.currPlayer = nextplayer;
        return nextplayer;
    }


    getCurrStatus(namespace){
    // return current player and card
        var temp = {};
        temp.currPlayer = this.data[namespace].me.currPlayer;
        temp.currCard = this.data[namespace].me.currCard;
        temp.currTokens = this.data[namespace].me.currTokens;
        return temp;
    }

    getNameSpace(namespace){
        return this.data[namespace];
    }

    getUser(namespace, username) {
        return this.data[namespace].players[username];
    }

    __shuffle(arr){
        // internal function..
        // shuffle an array
        let currIndex = arr.length, randomIndex;
        while(currIndex != 0){
            randomIndex = Math.floor(Math.random()*currIndex);
            currIndex--;
            [arr[currIndex], arr[randomIndex]] = [
                arr[randomIndex], arr[currIndex]];
        }
        return arr;
    }

}


// export the Game class
module.exports = {
    Game: Game,
}
