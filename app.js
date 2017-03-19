var express = require('express');
var app = express();
app.use('/', express.static(__dirname + '/'));
var http = require('http').Server(app);
var io = require('socket.io')(http);
var boxArray = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.emit('update screen', boxArray);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  socket.on('send message', function(msg){
    console.log('message: ' + msg);
    io.emit('send message', msg);
  });

  socket.on('new box', function(boxes) {
    boxArray = boxes;
    socket.broadcast.emit('new box', boxes);
  });

  socket.on('delete box', function(boxId) {
    for (var i = 0; i < boxArray.length; i++) {
      if (boxId == boxArray[i].id) {
        boxArray[i].id = 'removed';
      }
    }
    socket.broadcast.emit('delete box', boxId);
  })

  socket.on('update text', function(data) {
    socket.broadcast.emit('update text', data);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});