var board = document.getElementById('board');

board.addEventListener('click', getClickPosition, false);

function getClickPosition(el) {
  var xPosition = el.pageX;
  var yPosition = el.pageY;

  console.log(xPosition, yPosition);

  var box = document.createElement('div');
  box.className = "box";
  box.style.top = yPosition;
  box.style.left = xPosition;

  board.appendChild(box);
}