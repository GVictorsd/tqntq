
class Game {
    constructor() {
        // global state data of all the users and namespaces
        this.data = {};
    }
    // data structure (this.data)
    // data: {
    //     ns1: {players: {..}, me: {cards:[]}, users: []},
    //     ns2: {players: {..}, me: {cards:[]}, users: []},
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
        try{
            if(this.data[namespace].players[username] !== undefined){
                return false
            }
            this.data[namespace].players[username] = {cards:[], tokens:0};
            this.data[namespace].users.push(username);
            return true;
        }catch{
            console.log('namespace: ' + namespace + ' doesnt exists');
            return false;
        }
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


// const game = new Game();


// if(!game.addNameSpace('ns1')){
//     print('namespace exists');
//     process.exit();
// }

// game.addUser('ns1', 'usr1');
// game.addUser('ns1', 'usr2');
// game.addUser('ns1', 'usr3');

// game.initialise('ns1');

// // console.log(game.data)
// console.log(game.data['ns1'].me)
// // console.log(game.data['ns1'].players['usr1'])
// // console.log(game.data['ns1'].players['usr2'])
// // console.log(game.data['ns1'].players['usr3'])
// console.log(game.getNextCard('ns1'));
// console.log(game.data['ns1'].me)
// console.log(game.getNextPlayer('ns1'));
// console.log(game.data['ns1'].users);
// console.log(game.getNextPlayer('ns1'));

// console.log(game.data['ns1'].users);

// game.addCard('ns1', 'usr1', 9, 5);
// console.log(game.getUser('ns1', 'usr1'));

// game.addCard('ns1', 'usr1', 5, 2);
// console.log(game.getUser('ns1', 'usr1'));

// console.log(game.data);
