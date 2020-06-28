var canvas = document.getElementById("breakoutCanvas");
var ctx = canvas.getContext("2d");

var randomColor = Math.floor(Math.random()*16777215).toString(16);
var ballRandomColor = Math.floor(Math.random()*16777215).toString(16); // this one runs only once.
var playerScore = 0;
var playerLives = 3;
var powerUp = "";

var x = canvas.width/2;  //starting point of ball x. center
var y = canvas.height-30; //starting point of ball y. bottom of box

var dx = 2;  //movement rate per frame
var dy = -2;
//----------player power states------
var isSuperBall = false;
var isPaddleUp = false;

var ballRadius = 10;

var playerHeight = 10;
var playerWidth = 75;
var playerUpWidth = 150;
var playerPos = (canvas.width - playerWidth) / 2; //X coordinate of player

var leftKey = false;
var rightKey = false;

var block = {
    rows: 5,        //can change this object to make it harder
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
        blocks[yY][xX] = { x: 0, y: 0, state: 1}; //initialize each block array as an object
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function effectRandomizer(){
    let effect = Math.floor(Math.random() * 10); //for random effect
    if(effect > 5){
        //activate superball
        //superBall();
        paddleUp();
    } 
    
}
var paddleTimer;
function paddleUp(){
    if(!isPaddleUp){
        isPaddleUp = true;
        powerUp = "Paddle Up!"
        paddleTimer = setTimeout(resetPaddle=>{
            isPaddleUp = false;
            powerUp = "";
        },10000);
    } else {
        clearTimeout(paddleTimer);
        paddleTimer = setTimeout(resetPaddle=>{
            isPaddleUp = false;
            powerUp = "";
        },3000);
    }
}

var superBallTimer;
function superBall(){
    if(!isSuperBall){
        isSuperBall = true;
        powerUp = "Super Ball!";
        superBallTimer = setTimeout(resetSuper=>{
            isSuperBall = false;
            powerUp = "";
        },7000);
    } else { //extends superball duration if triggered while active
        clearTimeout(superBallTimer);
        superBallTimer = setTimeout(resetSuper=>{
            isSuperBall = false;
            powerUp = "";
        },7000);
    }
}

function drawBlocks(){
    for(let yY = 0; yY < block.columns; yY++){
        for(let xX = 0; xX < block.rows; xX++){
            if(blocks[yY][xX].state == 1){
                var blockX = (yY * (block.width + block.padding)) + block.offsetLeft;
                var blockY = (xX * (block.height + block.padding)) + block.offsetTop;
                blocks[yY][xX].x = blockX;
                blocks[yY][xX].y = blockY;
                ctx.beginPath();
                ctx.rect(blockX, blockY, block.width, block.height);
                ctx.fillStyle = `#${randomColor}`;
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}
function ballColorChanger(){
    ballRandomColor = Math.floor(Math.random()*16777215).toString(16);
}
function drawPlayer(){
    ctx.beginPath();
    ctx.rect(playerPos, canvas.height - playerHeight, playerWidth, playerHeight);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.closePath();
}

function drawBall(color){
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2); //draw circle first 2 are position on canvas
    ctx.fillStyle = `#${color}`; //fill color for the above shape
    ctx.fill();
    ctx.closePath();
}

function drawScore(){ //draws score on the canvas
    ctx.font = "16px monospace";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Score: ${playerScore}`, 8, 20); //number behind x,y on canvas
}

function drawPower(){ //draws score on the canvas
    ctx.font = "16px monospace";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${powerUp}`, (canvas.width / 2)-15, 20); //number behind x,y on canvas
}

function drawLives(){
    ctx.font = "16px monospace";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Lives: ${playerLives}`, canvas.width-95, 20); //drawn on the other side of the screen
}

function collisionDetection(){ //detection for blocks
    for(let yY = 0; yY < block.columns; yY++){
        for(let xX = 0; xX < block.rows; xX++){
            var b = blocks[yY][xX]; //adding a reference to each of the existing blocks
            if (b.state == 1){ //check if the block exists
                if(x > b.x && x < b.x + block.width && y > b.y && y < b.y + block.height){
                    if(!isSuperBall){
                        dy = -dy; //bounces the ball after collision.
                    }
                    b.state = 0; //set state of the block to 0 so it doesn't get drawn in next frame.
                    playerScore += 12;
                    ballColorChanger();
                    effectRandomizer();//testing random effects
                    if(playerScore == (block.rows * block.columns * 12)){
                        //gameover
                        alert("Win!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
            
        }
    }
}

function draw(){  //draw code here
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear frame before drawing
    drawBlocks(); //draws blocks

    if(isSuperBall){drawBall(Math.floor(Math.random()*16777215).toString(16));} 
        else drawBall(ballRandomColor);  //draws ball

    if(isPaddleUp){ //keep increasing player width until target reached
        if(playerWidth < playerUpWidth){
            playerWidth += 1;
        }
    } else {
        if(playerWidth != 75){
            playerWidth--;
        }
    }

    drawPlayer(); //draws player
    drawScore(); //draws score
    drawLives(); //draws lives
    drawPower(); //draws current powerup
//--------------------ball collision detection---------------------------
    collisionDetection(); //for blocks
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
            playerLives--;
            if(!playerLives){
                alert("Game Over!");
                document.location.reload();
                clearInterval(interval);
            } else {
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = 2;
                dy = -2;
                playerPos = (canvas.width - playerWidth) / 2;
            }
        }
    }
//--------------------player movement------------------------------------
    if(leftKey && playerPos > 0){ //collision detection for player otherwise it keeps clipping into box
        playerPos -= 7; //player movement speed left
        if (playerPos < 0){
            player = 0;
        }
    } else if(rightKey && playerPos < canvas.width - playerWidth){ 
        playerPos += 7;  //player movement speed right
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