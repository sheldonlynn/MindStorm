var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;
var currBox;
var mouseHold = false;
var zIndex = 5;
var textArea = '<textarea rows="7" cols="15"></textarea>';
var actionButtons = '<div class="actionButtons"><button class="delete" onClick="deleteThisBox(this)">' +
  '&#10005;</button><button class="post" onClick="updateText(this)">&#10003;</button></div>';

var boxArray = [
  //{"id": "box0", "x": 5, "y": 10, "text": "potato"}
];

var timerFinished;
var socket = io();

window.onload = function() {
  var svg = document.getElementById('logo');
  console.log(svg);
  svg.style.fontSize = window.innerWidth / 10;
}

window.onresize = function() {
  var svg = document.getElementById('logo');
  console.log(svg);
  svg.style.fontSize = window.innerWidth / 10;
}

socket.on('update screen', function(boxes) {
  for(var i = 0; i < boxes.length; i++) {
    box = boxes[i];
    if(!box.deleted) {
      drawBox(box.id, box.x, box.y, box.text);
      boxArray.push(box);
    }
  }
});

board.addEventListener('click', createBox, false);

socket.on('loaded', function(timerFinish) {
  timerFinished = timerFinish;
});

function createBox(e) {
  if (!timerFinished && timerStarted) {
    if (!mouseHold) {
      drawBox('box' + boxArray.length, e.pageX, e.pageY, '');
      boxArray.push({'id': ('box' + boxArray.length), 'x': e.pageX, 'y': e.pageY, 'text': '', 'deleted': false});
      socket.emit('new box', boxArray);

    }
    mouseHold = false;
  }
}
socket.on('new box', function(boxes) {
  for(var i = boxArray.length; i < boxes.length; i++) {
    box = boxes[i];
    drawBox(box.id, box.x, box.y, box.text);
    boxArray.push(box);
  }
});

function deleteThisBox(e) {
  var box = e.parentElement.parentElement;
  socket.emit('delete box', box.id);
  deleteBox(box.id);
}

function deleteBox(currBoxId) {
  for (var i = 0; i < boxArray.length; i++){
    if (boxArray[i].id == currBoxId){
      boxArray[i].removed = true;
    }
  }
  document.getElementById(currBoxId).remove();
}

socket.on('delete box', function(box) {
  console.log("is this happening?");
  deleteBox(box);
});

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

  box.firstChild.focus();
}

function updateText(e) {
  var currBox = e.parentElement.parentElement;
  var textValue = currBox.firstChild.value;
  updateArrayText(currBox, textValue);
  socket.emit('update text', {'id': currBox.id, 'text': textValue});
}

socket.on('update text', function(data) {
    var currBox = document.getElementById(data.id);
    currBox.firstChild.value = data.text;
    updateArrayText(currBox, data.text);
});

function updateArrayText(currBox, textValue) {
  for(var i = 0; i < boxArray.length; i++) {
    if (boxArray[i].id == currBox.id) {
      boxArray[i].text = textValue;
    }
  }
}

var stopWatch;

function mouseUp() {
  clearInterval(stopWatch);
  board.removeEventListener('mousemove', divMove, true);
  currBox = null;
}

function testTimer() {
  console.log("ayy");
  if (currBox != null) {
    var boxCopy = {
      'id': currBox.id,
      'x':  currBox.style.left,
      'y':  currBox.style.top,
      'zIndex': currBox.style.zIndex
    }
    socket.emit('move box', boxCopy);
  }
}
socket.on('move box', function(box) {
      changePos(box);
});
function changePos(box) {
  if (box != null) {
    var currBox = document.getElementById(box.id);
    currBox.style.left = box.x;
    currBox.style.top = box.y;
    currBox.style.zIndex = box.zIndex;
  }
}

function mouseDown(e) {
  mouseHold = true;
  currBox = e.target;
  console.log(currBox);
  if (currBox.className == "actionButtons") {
    currBox = currBox.parentElement;
  } else {
    currBox = null;
    clearInterval(stopWatch);
    stopWatch = null;
    return;
  }
  currBox.style.zIndex = zIndex++ + "";
  xPos = e.pageX - currBox.offsetLeft;
  yPos = e.pageY - currBox.offsetTop;
  stopWatch = setInterval(function(){ testTimer() }, 30);
  board.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  currBox.style.left = (e.pageX - xPos) + 'px';
  currBox.style.top = (e.pageY - yPos)  + 'px';
}

var timerStarted = false;

start.onclick = function() {
  socket.emit('timer start');
}

socket.on('timer finish', function(timerFinish) {
  timerFinished = timerFinish;
});

socket.on('update clock', function(time) {
  timerStarted = true;
  console.log(time);
  if (time.seconds < 10) {
    document.getElementById('clock').innerHTML = time.minutes + ':0' + time.seconds;
  } else {
    document.getElementById('clock').innerHTML = time.minutes + ':' + time.seconds;
  }
  if (time.seconds <= 0 && time.minutes <= 0) {
    document.getElementById('clock').innerHTML = "Time's up";

    var textareas = document.getElementsByTagName('textarea');

    for (var i = 0; i < textareas.length; i++) {
      textareas[i].readOnly = true;
    }
    return;
  }
});