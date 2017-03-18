var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
var currLine = 10;

function addText() {
  var text = document.getElementById("inputArea").value;
  var lineLength = text.length;
  ctx.font="20px Courier";
  ctx.fillText(text, 15, currLine += 30);
  
  ctx.beginPath();
  ctx.rect(10, currLine - 17, lineLength * 13, 20);
  ctx.stroke();
}

var textBox = new Drawable(){
  this.drawText = new addText() {
    
  }
}

function Drawable() {
  this.init = function(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }
}