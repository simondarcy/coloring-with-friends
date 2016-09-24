var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static('public'));

app.get('/', function(req, res){
    res.sendfile(__dirname+'/templates/index.html');
});


var onlineUsers = {};

io.on('connection', function(socket){

    io.emit('users', onlineUsers);

    //add new user to online
    onlineUsers[socket.id] = "";




    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('winner', function(msg){
        io.emit('winner', msg);
    });

    socket.on('new user', function(msg){
        onlineUsers[socket.id] = msg;
        io.emit('new user', msg);
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