var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;
var currBox;
var mouseHold = false;

board.addEventListener('click', createBox, false);

function createBox(e) {
  if (!mouseHold) {
    var box = document.createElement('div');

    box.style.top = e.pageY;
    box.style.left = e.pageX;

    box.id = "box" + boxIndex++;
    box.className = "box";

    box.addEventListener('mousedown', mouseDown, false);
    box.addEventListener('mouseup', mouseUp, false);

    console.log("ihvaisd");
    board.appendChild(box);
  }
  mouseHold = false;
}

function mouseUp(e) {
  board.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
  mouseHold = true;
  currBox = e.target;
  xPos = e.clientX - currBox.offsetLeft;
  yPos = e.clientY - currBox.offsetTop;
  board.addEventListener('mousemove', divMove, true);
  console.log("ayy");
}

function divMove(e) {
  console.log(e.pageY - yPos + "pageY - yPos");
  console.log(e.pageX - xPos + "pageX - xPos");
  currBox.style.top = (e.pageY - yPos)  + 'px';
  currBox.style.left = (e.pageX - xPos) + 'px';
  console.log("shit broke yo");
}