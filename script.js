var canvas = document.getElementById("breakoutCanvas");
var bContext = canvas.getContext("2d");

var x = canvas.width/2;  //starting point of x. center
var y = canvas.height-30; //starting point of y. bottom of box

var dx = 2;  //movement rate per frame
var dy = -2;

function draw(){  //draw code here
    bContext.clearRect(0, 0, canvas.width, canvas.height); //clear frame before drawing
    bContext.beginPath();
    bContext.arc(x, y, 10, 0, Math.PI*2, false); //draw circle first 2 are position on canvas
    bContext.fillStyle = "#000000"; //fill color for the above shape
    bContext.fill();
    bContext.closePath();
    x += dx;
    y += dy;
}

setInterval(draw, 10); //execute draw, refreshes




// bContext.beginPath();
// bContext.rect(20, 40, 50, 50);
// bContext.fillStyle = "green";
// bContext.fill();
// bContext.closePath();
