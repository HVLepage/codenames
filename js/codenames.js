//// Initialize Firebase.
var config = {
    apiKey: 'AIzaSyDApgyMBxrsCQo1ihEnB_PvRPLji5wymAs',
    authDomain: "codenames-d25c6.firebaseapp.com",
    databaseURL: "https://codenames-d25c6.firebaseio.com/"
};
firebase.initializeApp(config);

// // Get a reference to the database service
// var database = firebase.database();



function writeUserData(name, email, imageUrl) {
    var FBref = getFBref();
    var nums = [...Array(5).keys()];
    console.log(shuffle(nums));
    // var ranNums = shuffle([1,2,3,4,5,6,7,8,9,10]);
    firebase.database().ref(FBref).set({
      team: name,
      email: email,
      profile_picture : imageUrl
    });
  }






function spymaster(e, t) {
    if (t.is(':checked')) {
      $(e).find('input').attr('disabled', true);
    } else {
      $(e).find('input').removeAttr('disabled');
    }
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
}


