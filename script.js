var canvas = document.getElementById("breakoutCanvas");
var bContext = canvas.getContext("2d");

var x = canvas.width/2;  //starting point of x. center
var y = canvas.height-30; //starting point of y. bottom of box

var dx = 2;  //movement rate per frame
var dy = -2;

var ballRadius = 10;

var playerHeight = 10;
var playerWidth = 75;
var playerPos = (canvas.width - playerWidth) / 2;

var leftKey = false;
var rightKey = false;

var block = {
    rows: 3,        //can change this object to make it harder
    columns: 8,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30
}

var blocks = [];
for(let yY = 0; yY < block.columns; yY++){
    blocks[yY] = [];
    for(let xX = 0; xX < block.rows; xX++){
        blocks[yY][xX] = { x: 0, y: 0 }; //initialize each block array as an object
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function drawBlocks(){
    for(let yY = 0; yY < block.columns; yY++){
        for(let xX = 0; xX < block.rows; xX++){
            var blockX = (yY * (block.width + block.padding)) + block.offsetLeft;
            var blockY = (xX * (block.height + block.padding)) + block.offsetTop;
            blocks[yY][xX].x = blockX;
            blocks[yY][xX].y = blockY;
            bContext.beginPath();
            bContext.rect(blockX, blockY, block.width, block.height);
            bContext.fillStyle = "#000000";
            bContext.fill();
            bContext.closePath();
        }
    }
}

function drawPlayer(){
    bContext.beginPath();
    bContext.rect(playerPos, canvas.height - playerHeight, playerWidth, playerHeight);
    bContext.fillStyle = "#000000";
    bContext.fill();
    bContext.closePath();
}

function drawBall(){
    bContext.beginPath();
    bContext.arc(x, y, ballRadius, 0, Math.PI*2); //draw circle first 2 are position on canvas
    bContext.fillStyle = "#000000"; //fill color for the above shape
    bContext.fill();
    bContext.closePath();
}

function draw(){  //draw code here
    bContext.clearRect(0, 0, canvas.width, canvas.height); //clear frame before drawing
    drawBlocks(); //draws blocks
    drawBall(); //draws ball
    drawPlayer(); //draws player
//--------------------ball collision detection---------------------------
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
        dx = -dx; //if ball touches left or right "bounce" it by inverting the movement rate
    }
    if(y + dy < ballRadius){
        dy = -dy; //collision detection with top of the box.
    } else if(y + dy > canvas.height - ballRadius){
        if(x > playerPos && x < playerPos + playerWidth){ //collision detection with player bar
            dy = -dy;
        } else {
            //game end state because ball touches bottom bar. can add lives here.
            console.log("end state triggered");
            document.location.reload();
            clearInterval(interval);
        }
    }
//--------------------player movement------------------------------------
    if(leftKey && playerPos > 0){ //collision detection for player otherwise it keeps clipping into box
        playerPos -= 7; //player movement speed left
        if (playerPos < 0){
            player = 0;
        }
    } else if(rightKey && playerPos < canvas.width - playerWidth){ 
        playerPos +=7;  //player movement speed right
        if (playerPos + playerWidth > canvas.width){
            playerPos = canvas.width - playerWidth;
        }
    }

    x += dx;    //moves the ball
    y += dy;
}

function keyUpHandler(e){
    if(e.key == "ArrowRight"){
        rightKey = false;
    } else if (e.key == "ArrowLeft"){
        leftKey = false;
    }
}

function keyDownHandler(e){
    if(e.key == "ArrowRight"){
        rightKey = true;
    } else if (e.key == "ArrowLeft"){
        leftKey = true;
    }
}

var interval = setInterval(draw, 10); //execute draw, refreshes