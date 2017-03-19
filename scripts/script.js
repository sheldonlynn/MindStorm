var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;
var currBox;
var mouseHold = false;
var textArea = '<textarea rows="9" cols="15"></textarea>';
var actionButtons = '<div class="actionButtons"><button class="post" onClick="buttonClick(this)">Y</button></div>';
var boxArray = [{"id": "box0", "x": 5, "y": 10, "text": "potato"},
  {"id": "box1", "x": 75, "y": 30, "text": "potato"},
  {"id": "box2", "x": 5, "y": 200, "text": "potato"},
  {"id": "box3", "x": 200, "y": 200, "text": "potato"}];

var socket = new WebSocket('ws://echo.websocket.org');

socket.onopen = function(event) {
  console.log("mufukkkaaa");
};

socket.onerror = function(error) {
  console.log('WebSocket Error: ' + error);
};

var wrapper = {
  //index : 0
  box : currBox
};

board.addEventListener('click', createBox, false);

function buttonClick(el) {
  var currBox = el.parentElement.parentElement;
  var textValue = currBox.firstChild.value;
  socket.send(textValue);
}

socket.onmessage = function(event) {
  var message = event.data;
  console.log(message, "message received");
};

function createBox(e) {
  if (!mouseHold) {
    drawBox("box" + boxArray.length, e.pageX, e.pageY, "");
    boxArray.push({"id": ("box" + boxArray.length), "x": e.pageX, "y": e.pageY, "text": ""});
  }
  mouseHold = false;
}

function drawFromArray() {
  for (var i = 0; i < boxArray.length; i++) {
    var box = boxArray[i];
    console.log(box, "box");
    drawBox(box.id, box.x + "px", box.y + "px", box.text);
  }
}

function drawBox(id, x, y, text) {
  var box = document.createElement('div');
  box.innerHTML = textArea + actionButtons;
  box.style.left = x;
  box.style.top = y;

  box.firstChild.value = text;

  box.id = id;
  box.className = "box";

  box.addEventListener('mousedown', mouseDown, false);
  box.addEventListener('mouseup', mouseUp, false);

  board.appendChild(box);
}



function mouseUp(e) {
  wrapper.box = currBox;
  console.log(wrapper.box.style.left + "wrapper box");
  board.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  mouseHold = true;
  currBox = e.target;
  xPos = e.clientX - currBox.offsetLeft;
  yPos = e.clientY - currBox.offsetTop;
  board.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  currBox.style.left = (e.pageX - xPos) + 'px';
  currBox.style.top = (e.pageY - yPos)  + 'px';
}