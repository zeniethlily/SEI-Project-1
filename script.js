var canvas = document.getElementById("breakoutCanvas");
var bContext = canvas.getContext("2d");

var x = canvas.width/2;  //starting point of x. center
var y = canvas.height-30; //starting point of y. bottom of box

var dx = 2;  //movement rate per frame
var dy = -2;

var ballRadius = 10;


function drawBall(){
    bContext.beginPath();
    bContext.arc(x, y, ballRadius, 0, Math.PI*2, false); //draw circle first 2 are position on canvas
    bContext.fillStyle = "#000000"; //fill color for the above shape
    bContext.fill();
    bContext.closePath();
}

function draw(){  //draw code here
    bContext.clearRect(0, 0, canvas.width, canvas.height); //clear frame before drawing
    drawBall(); //draws ball
//--------------------ball collision detection---------------------------
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx; //if ball touches left or right "bounce" it by inverting the movement rate
    }

    if(y + dy > canvas.height - ballRadius || y + dy < ballRadius){
        dy = -dy; //if ball touches top or bottom "bounce" it by inverting the movement rate
    }


    x += dx;    //moves the ball
    y += dy;
}

setInterval(draw, 10); //execute draw, refreshes




// bContext.beginPath();
// bContext.rect(20, 40, 50, 50);
// bContext.fillStyle = "green";
// bContext.fill();
// bContext.closePath();
