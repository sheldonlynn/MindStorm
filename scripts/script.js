var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;
var currBox;
var mouseHold = false;
var textArea = '<textarea rows="9" cols="15"></textarea>';
var actionButtons = '<div class="actionButtons"><button class="post">Y</button></div>';

var boxArray = [
  {"id": "box0", "x": 5, "y": 10, "text": "potato"},
  {"id": "box1", "x": 75, "y": 30, "text": "potato"},
  {"id": "box2", "x": 5, "y": 200, "text": "potato"},
  {"id": "box3", "x": 200, "y": 200, "text": "potato"}
];

var diffArray = [];

var wrapper = {
  //index : 0
  box : currBox
};

board.addEventListener('click', createBox, false);

function createBox(e) {
  console.log(e.pageX + "createbox");
  if (timerStarted) {
    if (!mouseHold) {
      drawBox("box" + boxArray.length, e.pageX, e.pageY, "potato");
      boxArray.push({"id": ("box" + boxArray.length), "x": e.pageX, "y": e.pageY, "text": ""});
    }
    mouseHold = false;
  }
}

function drawFromArray() {
  for (var i = 0; i < boxArray.length; i++) {
    var box = boxArray[i];
    console.log(box, "box");
    drawBox(box.id, box.x + "px", box.y + "px", box.text);
  }
}

function drawBox(id, x, y, text) {
  console.log(x + "drawbox");
  var box = document.createElement('div');
  box.innerHTML = textArea + actionButtons;
  box.style.left = x + "px";
  box.style.top = y + "px";

  box.firstChild.value = text;

  box.id = id;
  box.className = "box";

  box.addEventListener('mousedown', mouseDown, false);
  box.addEventListener('mouseup', mouseUp, false);

  board.appendChild(box);
}



function mouseUp(e) {
  wrapper.box = currBox;
  board.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  mouseHold = true;
  currBox = e.target;
  console.log(e.pageX + "mousedown");
  xPos = e.pageX - currBox.offsetLeft;
  yPos = e.pageY - currBox.offsetTop;
  board.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  currBox.style.left = (e.pageX - xPos) + 'px';
  currBox.style.top = (e.pageY - yPos)  + 'px';
}


var seconds = 10;
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
    document.getElementById('clock').innerHTML = minutes + ":0" + seconds;
  } else {
    document.getElementById('clock').innerHTML = minutes + ":" + seconds;
  }
  
  if (seconds == 0 && minutes == 0) {
    seconds = 10;
    minutes = 0;
    timerStarted = false;
    document.getElementById('clock').innerHTML = "Time's up";
    
    var textareas = document.getElementsByTagName("textarea");
    
    for (var i = 0; i < textareas.length; i++) {
      textareas[i].readOnly = true;
    }
    return;
  
  }
  timer();
}

start.onclick = function() {
  if (!timerStarted)
    timer();
}

function timer() {
  timerStarted = true;
  setTimeout(countDown, 1000);
}