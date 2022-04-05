
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
        var ctnr = document.getElementById('scoreCtnr').getElementsByTagName('p')[0];
        ctnr.innerText = score;
    }
    function docSetCardNo(num){
        var ctnr = document.getElementById('card');
        ctnr.innerText = num;
    }
    function docSetCardToken(num){
        var ctnr = document.getElementById('cardToken');
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
        ctnr.style.height = '8em';
        ctnr.style.backgroundColor = 'hotpink';
        ctnr.style.marginTop = '20px';

        var usrNamectnr = document.createElement('p');
        usrNamectnr.textContent = uid;
        // usrNamectnr.style.textAlign = 'center';
        usrNamectnr.style.position = 'relative';
        usrNamectnr.style.left = '7%';
        usrNamectnr.style.height = '0px';
        usrNamectnr.style.paddingTop = '10px';

        var cardsCtnr = document.createElement('div');
        cardsCtnr.style.backgroundColor = 'coral';
        cardsCtnr.style.position = 'relative';
        cardsCtnr.style.width = '90%';
        cardsCtnr.style.height = '65%';
        cardsCtnr.style.top = '5%';
        cardsCtnr.style.left = '5%';
        cardsCtnr.style.display = 'flex';

        cardsCtnr.id = 'z' + uid;      // append char str to prevent collisions

        cardsCtnr.style.backgroundColor = 'coral';


        ctnr.appendChild(usrNamectnr);
        ctnr.appendChild(cardsCtnr);
        mycrds.appendChild(ctnr);
    }

    function addCard(uid, cards){
        console.log('addCard uid: ' + uid + 'cards: ' + cards);
        var ctnrid = 'z' + uid;
        var cardsCtnr = document.getElementById(ctnrid);
        cardsCtnr.innerHTML = '';

        for(var i=0; i<cards.length; i++){
            var card = document.createElement('div');
            card.style.height = '20px';
            card.style.width = '20px';
            card.style.backgroundColor = 'beige';
            card.textContent = cards[i];

            cardsCtnr.appendChild(card);
        }
    }