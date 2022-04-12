
            // <p id="inviteText">Invite</p>
            // <p id="namespaceurl" style="visibility: hidden; width: 60%; overflow-x:auto; padding: 3px; border-radius: 5px; font-family: monospace; background-color: rgba(255, 255, 255, 0.25);"></p>
            // <button id="shareCopybtn" style="visibility: hidden;">Copy</button>
        
var shared = false;
function inviteToNamespace(){
    // dont execute multiple times
    if(shared) return;
    shared = true;

    var invitediv = document.getElementById('invite');
    var invitetxt = document.getElementById('inviteText');
    invitetxt.style.visibility = 'hidden';
    invitetxt.style.width = '0px';
    var namespaceurl =  document.getElementById('namespaceurl');

    namespaceurl.style.visibility = 'visible';

    var nsUrl = window.location.href;
    nsUrl = nsUrl.substring(0, nsUrl.lastIndexOf('/'));

    namespaceurl.value = nsUrl + '?ns=' + namespace;

    var msgdiv = document.createElement('p');
    msgdiv.style.height = '5px';
    msgdiv.style.fontFamily= 'monospace';
    msgdiv.style.fontSize = '12px';
    msgdiv.style.color = 'color:rgb(85, 85, 85)';
    msgdiv.textContent = 'Share the URL to other players';
    invitediv.appendChild(msgdiv);

    // invitediv.onclick = () => {
    //     navigator.clipboard.writeText(nsUrl).then(function(){
    //         copybtn.textContent = 'copied';
    //     }, function() {
    //         copybtn.textContent = 'failed';
    //     })
    // };
}


// functions for players View
function docAddPlayerPlayersView(playerList){
    var playersCtnr = document.getElementById('playersViewList');
    playersCtnr.innerHTML = '';

    for(var i=0; i<playerList.length; i++){
        var ctnr = document.createElement('div');
        var ctnrTxt = document.createElement('p');

        ctnr.style.position = 'relative';
        // ctnr.style.width = '80%';
        ctnr.style.width = '80%';
        ctnr.style.height = '5em';
        ctnr.style.marginBottom = '2em';
        // ctnr.style.backgroundColor = 'blue';
        ctnr.style.background = 'rgba(255, 255, 255, 0.25)';
        ctnr.style.boxShadow = '10px 10px 18px 0 rgba(31, 38, 135, 0.2)';
        ctnr.style.backdropFilter = 'blur(10px);'
        ctnr.style.border = '3px solid rgba(255, 255, 255, 0.18)';
        ctnr.style.borderRadius = '20px';

        ctnr.style.textAlign = 'center';
        ctnrTxt.style.fontSize = '30px';
        ctnrTxt.style.height= '0px';
        ctnrTxt.style.position = 'relative';
        ctnrTxt.style.top = '25%';
        ctnrTxt.style.color = 'black';
            

        // ctnr.textContent = playerList[i];
        ctnrTxt.textContent = playerList[i];
        ctnr.appendChild(ctnrTxt);

        playersCtnr.appendChild(ctnr);
    }
}

// functions to change UI elements
function docSetUserName(name){
    var usr = document.getElementById('usrName').firstElementChild;
    usr.innerText = name;
}
function docSetToken(count){
    var ctnr = document.getElementById('token-count').getElementsByTagName('p')[0];
    ctnr.innerText = count;
}
function docSetScore(score){
    var ctnr = document.getElementById('scorePanw').getElementsByTagName('p')[0];
    ctnr.innerText = score;
}
function docSetCardNo(num){
    var ctnr = document.getElementById('cardNo');
    ctnr.innerText = num;
}
function docSetCardToken(num){
    var ctnr = document.getElementById('cardTokenNo');
    ctnr.innerText = num;
}
function docSetCurrUser(name){
    var ctnr = document.getElementById('currActiveUser');
    ctnr.innerText = name;
}


function addNewCardTable(uid){
    var mycrds = document.getElementById('myCards');
    var ctnr = document.createElement('div');
    ctnr.style.width = '100%';
    ctnr.style.height = '10em';

    // ctnr.style.backgroundImage = 'linear-gradient(to top right, #f190b7, cornflowerblue)';
    ctnr.style.backgroundImage = 'linear-gradient(to right, #faedcd, #d4a373)';
    // ctnr.style.backgroundColor = '#faedcd';
    ctnr.style.marginTop = '20px';
    ctnr.style.borderRadius = '20px';
    ctnr.style.textAlign = 'center';

    var usrNamectnr = document.createElement('p');
    usrNamectnr.textContent = uid;
    // usrNamectnr.style.textAlign = 'center';
    usrNamectnr.style.position = 'relative';
    // usrNamectnr.style.left = '7%';
    usrNamectnr.style.height = 'fit-content';
    // usrNamectnr.style.paddingTop = '10px';

    var cardsCtnr = document.createElement('div');
    cardsCtnr.style.position = 'relative';
    cardsCtnr.style.width = '90%';
    cardsCtnr.style.height = '65%';
    cardsCtnr.style.top = '5%';
    cardsCtnr.style.left = '5%';
    cardsCtnr.style.display = 'flex';
    cardsCtnr.style.flexWrap = 'wrap';

    cardsCtnr.id = 'z' + uid;      // append char str to prevent collisions

    // cardsCtnr.style.backgroundImage =  'linear-gradient(to top right, #7fffd4, white 100%)';
    cardsCtnr.style.background = 'rgba(0, 0, 0, 0)';
    // cardsCtnr.style.border = '3px solid rgba(255, 255, 255, 0.18)';
    cardsCtnr.style.border = '3px solid gray';
    // cardsCtnr.style.backgroundColor = 'coral';


    ctnr.appendChild(usrNamectnr);
    ctnr.appendChild(cardsCtnr);
    mycrds.appendChild(ctnr);
}

function addCard(uid, cards){
    console.log('addCard uid: ' + uid + 'cards: ' + cards);
    var ctnrid = 'z' + uid;
    var cardsCtnr = document.getElementById(ctnrid);
    cardsCtnr.innerHTML = '';

    var _addcrd = (clr) => {
        var card = document.createElement('div');
        var cardTxt = document.createElement('p');
        card.style.height = '2em';
        card.style.width = '2em';
        card.style.margin = '5px';
        card.style.backgroundColor = clr;
        card.style.border = '1px solid gray';
        card.style.borderRadius = '10px';
        cardTxt.textContent = cards[i];
        cardTxt.style.height = '0px';
        cardTxt.style.fontSize = '2ch';

        card.appendChild(cardTxt);
        cardsCtnr.appendChild(card);
    }

    for(var i=0; i<cards.length; i++){
        if(cards[i] + 1 == cards[i+1]){
            while(cards[i] + 1 == cards[i+1]){
                _addcrd('#caffbf');
                i++;
            }
                _addcrd('#caffbf');
        }
        else{
            _addcrd('#90dbf4');
        }
    }
}