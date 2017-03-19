var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;
var currBox;
var mouseHold = false;
var textArea = '<textarea rows="8" cols="15"></textarea>';
var actionButtons = '<div class="actionButtons"><button class="delete" onClick="deleteThisBox(this)">' +
  'X</button><button class="post" onClick="updateText(this)">Y</button></div>';

var boxArray = [
  //{"id": "box0", "x": 5, "y": 10, "text": "potato"}
];

var socket = io();

socket.on('update screen', function(boxes) {
  for(var i = 0; i < boxes.length; i++) {
    box = boxes[i];
    if(box.id != 'removed') {
      drawBox(box.id, box.x, box.y, box.text);
      boxArray.push(box);
    }
  }
});

board.addEventListener('click', createBox, false);

function createBox(e) {
  if (timerStarted) {
    if (!mouseHold) {
      var val = Math.random();
      drawBox('box' + boxArray.length, e.pageX, e.pageY, val);
      boxArray.push({'id': ('box' + boxArray.length), 'x': e.pageX, 'y': e.pageY, 'text': val});
      socket.emit('new box', boxArray);
      socket.on('new box', function(boxes) {
        for(var i = boxArray.length; i < boxes.length; i++) {
          box = boxes[i];
          drawBox(box.id, box.x, box.y, box.text);
          boxArray.push(box);
        }
      });
    }
    mouseHold = false;
  }
}

function deleteThisBox(e) {
  var box = e.parentElement.parentElement;
  console.log(box.id, "box");
  socket.emit('delete box', box.id);
  socket.on('delete box', function(box) {
    console.log("is this happening?");
    deleteBox(box);
  });
  deleteBox(box.id);
}

function deleteBox(currBoxId) {
  for (var i = 0; i < boxArray.length; i++){
    if (boxArray[i].id == currBoxId){
      boxArray[i].id = 'removed';
    }
  }
  document.getElementById(currBoxId).remove();
}

function drawFromArray() {
  for (var i = 0; i < boxArray.length; i++) {
    var box = boxArray[i];
    drawBox(box.id, box.x + 'px', box.y + 'px', box.text);
  }
}

function drawBox(id, x, y, text) {
  var box = document.createElement('div');
  box.innerHTML = textArea + actionButtons;
  box.style.left = x + 'px';
  box.style.top = y + 'px';

  box.firstChild.value = text;

  box.id = id;
  box.className = 'box';

  box.addEventListener('mousedown', mouseDown, false);
  box.addEventListener('mouseup', mouseUp, false);

  board.appendChild(box);
}

function updateText(e) {
  var currBox = e.parentElement.parentElement;
  var textValue = currBox.firstChild.value;
  socket.emit('update text', {'id': currBox.id, 'text': textValue});
  socket.on('update text', function(data) {
    document.getElementById(data.id).firstChild.value = data.text;
  });
}

function mouseUp(e) {
  var boxCopy = {
    'id': currBox.id,
    'x':  currBox.style.left,
    'y':  currBox.style.top
  }
  if (boxCopy != null) {
    socket.emit('move box', boxCopy);
    socket.on('move box', function(box) {
    changePos(box);
    });
  }
  board.removeEventListener('mousemove', divMove, true);
}



function changePos(box) {
  var currBox = document.getElementById(box.id);
  currBox.style.left = box.x;
  currBox.style.top = box.y;
}

function mouseDown(e) {
  mouseHold = true;
  currBox = e.target;
  if (currBox.className == "actionButtons") {
    currBox = currBox.parentElement;
  }
  xPos = e.pageX - currBox.offsetLeft;
  yPos = e.pageY - currBox.offsetTop;
  board.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  currBox.style.left = (e.pageX - xPos) + 'px';
  currBox.style.top = (e.pageY - yPos)  + 'px';
}


var seconds = 2;
var minutes = 0;
var watch = document.getElementById('h1');
var start = document.getElementById('start');
var timerStarted;


function countDown() {
  seconds--;
  if (seconds < 0 && minutes > 0) {
    seconds = 59;
    minutes--;
  }
  if (seconds < 10) {
    document.getElementById('clock').innerHTML = minutes + ':0' + seconds;
  } else {
    document.getElementById('clock').innerHTML = minutes + ':' + seconds;
  }

  if (seconds == 0 && minutes == 0) {
    seconds = 10;
    minutes = 0;
    timerStarted = false;
    document.getElementById('clock').innerHTML = "Time's up";

    var textareas = document.getElementsByTagName('textarea');

    for (var i = 0; i < textareas.length; i++) {
      textareas[i].readOnly = true;
    }
    return;

  }
  timer();
}

start.onclick = function() {
  if (!timerStarted) {
    var timer = setInterval(function() {
      seconds--;
      if (seconds < 0 && minutes > 0) {
        seconds = 59;
        minutes--;
      }
      if (seconds < 10) {
        document.getElementById('clock').innerHTML = minutes + ':0' + seconds;
      } else {
        document.getElementById('clock').innerHTML = minutes + ':' + seconds;
      }

      if (seconds == 0 && minutes == 0) {
        clearInterval(timer);
        seconds = 10;
        minutes = 0;
        timerStarted = false;
        document.getElementById('clock').innerHTML = "Time's up";

        var textareas = document.getElementsByTagName('textarea');

        for (var i = 0; i < textareas.length; i++) {
          textareas[i].readOnly = true;
        }
        return;
      }
    }, 1000);
  }
}