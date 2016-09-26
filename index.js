var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendfile(__dirname+'/templates/index.html');
});


var onlineUsers = {};

var gameid;

io.use(function(socket, next) {
    var handshakeData = socket.request;
    gameid = handshakeData._query['gameid'];
    console.log("middleware:", handshakeData._query['gameid']);
    next();
});

io.on('connection', function(socket){

    io.emit('users', onlineUsers);
    //add new user to online
    onlineUsers[socket.id] = "";

    if(gameid == "null") {
        gameid = socket.id;
    }


    socket.join(gameid);

    io.emit('gameid', gameid);

    io.to(gameid).emit('debug', Math.floor(Math.random() * 1000) );


    socket.on('winner', function(msg){
        io.emit('winner', msg);
    });

    socket.on('restart', function(msg){
        io.emit('restart', msg);
    });

    socket.on('new user', function(user){

        //Update  socket with the user name
        onlineUsers[socket.id] = user;
        //send user back up to the client
        io.emit('new user', user);
        //Send back full user list
        io.emit('users', onlineUsers);
    });

    socket.on('disconnect', function(){
        console.log(onlineUsers[socket.id] + " has left the room");
        delete onlineUsers[socket.id];
        io.emit('users', onlineUsers);
    });


});


http.listen(process.env.PORT || 3000, function(){
    console.log('listening on *:3000');
});