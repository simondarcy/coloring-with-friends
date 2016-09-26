var socket = io(window.location.origin, { query: "gameid="+getParameterByName("gameid") });

var me;

function startGame(){
    $('#game').removeClass("hidden");
}


//Main enterance screen
$('#user').submit(function(){
    me = $('#username').val();
    socket.emit('new user', me);
    $('#intro').addClass("hidden");
    startGame();
    return false;
});

socket.on('new user', function(msg){
    $('#messages').append($('<li>').text(msg+" has joined the game"));
});

socket.on('users', function(users){
    $('#users').html("");
    console.log(users);
    noOfUsers = Object.keys(users).length;
    if(noOfUsers == 0){
        $('#users').html("<p>No other users online...</p>");
    }
    else {
        $('#users').html("<p>Playing now: " + noOfUsers + "</p>");
        $.each(users, function (key, value) {
            $('#users').append(value + "<br/>");
        });
    }

});

socket.on('debug', function(msg) {
    console.log(msg);
});


socket.on('gameid', function(id) {
    $('#url').text(window.location.origin+"?gameid="+id);
});


function endCountdown() {
    // logic to finish the countdown here
    console.log('play!')
}

function handleTimer() {
    if(count === 0) {
        clearInterval(timer);
        endCountdown();
    } else {
        console.log(count);
        count--;
    }
}

var count = 3;
var timer = setInterval(function() { handleTimer(count); }, 1000);


//rest of game


//helpers
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
