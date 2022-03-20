const mod = require('./gameLib');
let print = mod.prints;
let Game = mod.Game;

print('hello imports...');


const game = new Game();


if(!game.addNameSpace('ns1')){
    print('namespace exists');
    process.exit();
}

game.addUser('ns1', 'usr1');
game.addUser('ns1', 'usr2');
game.addUser('ns1', 'usr3');

game.initialise('ns1');

console.log(game.data)