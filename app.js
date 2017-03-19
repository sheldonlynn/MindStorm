var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var fs = require('fs');
var lineReader = require('readline');

var boxArray = [];
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('send message', function(msg){
    console.log('message: ' + msg);
    io.emit('send message', msg);
  });

  socket.on('new box', function(boxes) {
    socket.broadcast.emit('new box', boxes);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});