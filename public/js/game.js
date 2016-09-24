var socket = io();

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


//rest of game