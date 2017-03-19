var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;

board.addEventListener('click', createBox, false);

function createBox(e) {
  var box = document.createElement('div');

  box.style.top = e.pageY;
  box.style.left = e.pageX;

  box.id = "box" + boxIndex++;
  box.className = "box";

  box.addEventListener('mousedown', mouseDown, false);
  box.addEventListener('mouseup', mouseUp, false);

  board.appendChild(box);
}

function mouseUp(e) {
  e.target.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  var currBox = document.getElementById(e.target.id);
  xPos = e.clientX - currBox.offsetLeft;
  yPos = e.clientY - currBox.offsetTop;
  currBox.addEventListener('mousemove', divMove, true);
}

function divMove(e) {
  var currBox = e.target;
  currBox.style.top = (e.clientY - yPos)  + 'px';
  currBox.style.left = (e.clientX - xPos) + 'px';
}