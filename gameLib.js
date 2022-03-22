
class Game {
    constructor() {
        // global state data of all the users and namespaces
        this.data = {};
    }
    // data structure (this.data)
    // data: {
    //     ns1: {players: {..}, me: {cards:[]}, users: [], authorizerToken},
    //     ns2: {players: {..}, me: {cards:[]}, users: [], authorizerToken},
    //     ...
    // }
    // players: {
    //     cards: [], tokens: <int>
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
        this.data[namespace].players[username] = {cards:[], tokens:0};
        this.data[namespace].users.push(username);
        return true;
    }

    addCard(namespace, username, card, tokens) {
        var user = this.getUser(namespace, username);
        if(user === undefined){
            return false;
        }
        user.cards.push(card);
        user.cards.sort();
        user.tokens += tokens;
        return {'cards': user.cards, 'tokens': user.tokens};
    }

    useToken(namespace, username) {
        var user = this.getUser(namespace, username);
        if(user === undefined){
            return false;
        }
        return user.tokens > 0 ? --user.tokens : false;
    }

    initialise(namespace){
        // Once this method is called, stop taking more
        // connections to this namespace

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


        return true;
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
        return this.data[namespace].me.cards.pop();
    }
    getNextPlayer(namespace){
        var nextplayer = this.data[namespace].users[0];
        this.data[namespace].users.push(this.data[namespace].users.shift(1));
        return nextplayer;
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
