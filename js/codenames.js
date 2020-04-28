//// Initialize Firebase.
var config = {
    apiKey: 'AIzaSyDApgyMBxrsCQo1ihEnB_PvRPLji5wymAs',
    authDomain: "codenames-d25c6.firebaseapp.com",
    databaseURL: "https://codenames-d25c6.firebaseio.com/"
};
firebase.initializeApp(config);


function fetchData(){
    var FBref = getFBref();
    return firebase.database().ref(FBref).once('value').then(function(snapshot) {
        if (snapshot.exists()){
            var i
            for (i = 0; i < 25; i++) {
                var boxid = "box" + i;
                document.getElementById(boxid).innerHTML = snapshot.val().card[i].word;
            }
            index = snapshot.val().index + 1;
        }
    });
}

function listen(){
    var gameState = firebase.database().ref(getFBref());
    gameState.on('value', function(snapshot) {
        if (snapshot.exists()){
            console.log('NEW GAME!' + snapshot.val().index);
        }
    });
}


function NewGame(){
    var FBref = getFBref();
    return firebase.database().ref(FBref).once('value').then(function(snapshot) {

        $.getJSON( "../codenames/assets/words.json", function( json ) {
            var i;
            var updates = {};
            if (FBref.slice(0, 2) == "FR"){
                var range = shuffle([...Array(json.French.length).keys()]);
                for (i = 0; i < 25; i++) {
                    updates['/card/' + i + '/word'] = json.French[range[i]];
                }
            }
            else if (FBref.slice(0, 2) == "EN"){
                var range = shuffle([...Array(json.English.length).keys()]);
                for (i = 0; i < 25; i++) {
                    updates['/card/' + i + '/word'] = json.English[range[i]];
                }
            }
            var roles = shuffle([...Array(25).keys()]);
            for (i = 0; i < 25; i++) {
                if (roles[i] < 9){
                    if (Math.random() < 0.5){
                        updates['/card/' + i + '/role'] = 'BF';
                    }
                    else{
                        updates['/card/' + i + '/role'] = 'BM';
                    }
                }
                else if (roles[i] < 17){
                    if (Math.random() < 0.5){
                        updates['/card/' + i + '/role'] = 'RF';
                    }
                    else{
                        updates['/card/' + i + '/role'] = 'RM';
                    }
                }
                else if (roles[i] < 18){
                    updates['/card/' + i + '/role'] = 'A';
                }
                else{
                    if (Math.random() < 0.5){
                        updates['/card/' + i + '/role'] = 'CF';
                    }
                    else{
                        updates['/card/' + i + '/role'] = 'CM';
                    }
                }
                updates['/card/' + i + '/flipped'] = false;
            }
            firebase.database().ref(FBref).update(updates);
            });

        // Update index and trigger fetchData()
        var index = 0;
        if (snapshot.exists()){
            index = snapshot.val().index + 1;
        }
        firebase.database().ref(FBref).update({'index': index});
        setTimeout(fetchData, 500);
        // fetchData();
      });
}



// function writeUserData(name, email, imageUrl) {
//     var FBref = getFBref();
//     var nums = [...Array(5).keys()];
//     console.log(shuffle(nums));
//     // var ranNums = shuffle([1,2,3,4,5,6,7,8,9,10]);
//     firebase.database().ref(FBref).set({
//       team: name,
//       email: email,
//       profile_picture : imageUrl
//     });
//   }


function spymaster() {
    var FBref = getFBref();
    return firebase.database().ref(FBref).once('value').then(function(snapshot) {
        if (snapshot.exists()){
            var checkBox = document.getElementById("spyCheck");
            var i
            for (i = 0; i < 25; i++) {
                var box = document.getElementById("box" + i);
                if (checkBox.checked == true){
                    box.style.color = '#FFFFFF';
                    box.style.fontWeight = 'bold';
                    box.style.webkitTextStroke = '1px black';
                    switch(snapshot.val().card[i].role){
                        case "A":
                            box.style.backgroundImage = 'url("./assets/agents/A.png")';
                            break;
                        case "CF":
                            box.style.backgroundImage = 'url("./assets/agents/CF.png")';
                            break;
                        case "CM":
                            box.style.backgroundImage = 'url("./assets/agents/CM.png")';
                            break;
                        case "RF":
                            box.style.backgroundImage = 'url("./assets/agents/RF.png")';
                            break;
                        case "RM":
                            box.style.backgroundImage = 'url("./assets/agents/RM.png")';
                            break;
                        case "BF":
                            box.style.backgroundImage = 'url("./assets/agents/BF.png")';
                            break;
                        case "BM":
                            box.style.backgroundImage = 'url("./assets/agents/BM.png")';
                            break;
                    }
                }
                else{
                    box.style.backgroundImage = 'url("./assets/agents/blank.png")';
                    box.style.color = '#242424';
                    box.style.fontWeight = 'normal';
                    box.style.webkitTextStroke = '0px black';
                }
            }
        }
    });
}




function shuffle(array) {
    var i = array.length,
        j = 0,
        temp;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        // Swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function getFBref(){
    const url = window.location;
    const urlObject = new URL(url);
    var lang_id = urlObject.searchParams.get('lang')
    var game_id = urlObject.searchParams.get('game')
    if (lang_id == null){
        lang_id = 'FR';
    }
    if (game_id == null){
        game_id = 'default';
    }
    var FBref = lang_id + '-' + game_id;
    return FBref
}

function myLang(language){
    const url = window.location;
    const urlObject = new URL(url);
    // const lang_id = urlObject.searchParams.get('lang')
    var game_id = urlObject.searchParams.get('game')
    if (game_id == null){
        game_id = 'default';
    }
    // console.log(lang_id) 
    const params = { 'lang': language, 'game': game_id}
    const paramString = new URLSearchParams(params)
    // console.log(`${window.location.href.split('?')[0]}?${paramString.toString()}`)
    const newURL = `${window.location.href.split('?')[0]}?${paramString.toString()}`
    window.history.pushState({path:newURL},'',newURL);
    gameIndex = firebase.database().ref(getFBref() + '/index');
    listen();
}


function joinGame(){
    const url = window.location;
    const urlObject = new URL(url);
    var lang_id = urlObject.searchParams.get('lang')
    if (lang_id == null){
        lang_id = 'FR';
    }
    // const game_id = urlObject.searchParams.get('game')
    var game_id = document.getElementById("fname").value;
    const params = { 'lang': lang_id, 'game': game_id}
    const paramString = new URLSearchParams(params)
    const newURL = `${window.location.href.split('?')[0]}?${paramString.toString()}`
    window.history.pushState({path:newURL},'',newURL);
    listen();
}


