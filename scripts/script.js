var board = document.getElementById('board');
var boxIndex = 0;
var xPos = 0;
var yPos = 0;
var currBox;
var mouseHold = false;
var textArea = '<textarea rows="9" cols="15">pls fill me bb</textarea>';
var actionButtons = '<div class="actionButtons"><button class="post">Y</button></div>';

var wrapper = {
  //index : 0
  box : currBox
};

board.addEventListener('click', createBox, false);

function createBox(e) {
  if (!mouseHold) {
    var box = document.createElement('div');
    box.innerHTML = textArea + actionButtons;
    box.style.top = e.pageY;
    box.style.left = e.pageX;

    box.id = "box" + boxIndex++;
    box.className = "box";

    box.addEventListener('mousedown', mouseDown, false);
    box.addEventListener('mouseup', mouseUp, false);

    board.appendChild(box);
  }
  mouseHold = false;
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
  currBox.style.top = (e.pageY - yPos)  + 'px';
  currBox.style.left = (e.pageX - xPos) + 'px';
}