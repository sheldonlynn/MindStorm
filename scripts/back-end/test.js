var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var root = path.join(__dirname, '..', '..'); // store root path of project
var fs = require('fs');
var lineReader = require('readline');

// route handler sending response to website home
app.get('/', function(req, res) {
  res.sendFile(path.join(root + '/index.html'));
});

// http listening on port 3000
http.listen(3000, function(){
  console.log('test');
});

// user connect
io.on('connection', function(socket) {
  console.log('new user');

  // create read stream
  var readFile = lineReader.createInterface({
    input: fs.createReadStream(root + '/text.txt')
  });

  // create write stream
  var writeFile = fs.createWriteStream(root + '/text.txt', {
    flags: 'a' //append to file
  });

  // read text file to fill screen with previously input text
  readFile.on('line', function (line) {
    socket.emit('chat message', line);
  });

  // write to text file to store input text
  socket.on('chat message', function(msg) {
    io.emit('chat message', msg);
    writeFile.write(msg + '\n');
  });

  // user disconnect
  socket.on('disconnect', function() {
    console.log('user gone');
    writeFile.close();
  });
});
