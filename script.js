var canvas = document.getElementById("breakoutCanvas");
var ctx = canvas.getContext("2d");
var interval;
//------------------------global vars----------------------------------

var gamePaused = false;

var powerUp = "";
var currentScore = 0;
var HiScore = 0;
var playerHeight = 10;
var playerWidth = 75;
var playerX = (canvas.width - playerWidth) / 2; //X coordinate of player
var player;
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
var bricks = [];

var ballRadius = 10;
var balls;
var ballLaunched = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

//all functions that need to be loaded at game start
function init(){
    player = new PaddlePop(playerX, canvas.height - playerHeight, playerWidth, playerHeight);
    balls = [];
    for(let c = 0; c < block.columns; c++){
        bricks[c] = [];
        for(let r = 0; r < block.rows; r++){
            bricks[c][r] = new Brick(0, 0, block.width, block.height); //initialize each brick
        }
    }
}
init();
interval = setInterval(draw, 10);
function draw(){
    if(!gamePaused){
        ctx.clearRect(0, 0, canvas.width, canvas.height); //clear frame before drawing
        //----player-------
        player.draw(); //draw and animate paddle
        player.move();
        drawScore();
        drawPower();
        drawLives();
        //----balls--------
        drawAllBalls(); //draw and animate balls
        moveAllBalls();
        removeBalls();
        //----bricks-------
        drawAllBricks();
        collisionDetection();
        if(allBricksDed()){
            //win state - reset bricks and player while keeping high score
            winScreen();
        }
        if(noMoreBalls() && ballLaunched){
            if(player.lives == 0){
                //gameover goes here
            } else {
                player.lives--;
                ballLaunched = false;
                //allow one more ball to be launched
            }
        }
    }

}

function drawAllBalls(){
    for(let ball of balls){
        ball.draw();
    }
}

function moveAllBalls(){
    for(let ball of balls){
        ball.move();
    }
}

function removeBalls(){
        for(let i = 0; i < balls.length; i++){
            if(!balls[i].exists){
                console.log("ball removed "+ i);
                balls.splice(i,1); //remove ball that doesn't exist
            }
        }
}

function noMoreBalls(){
    let boole = true;
    for(let i = 0; i < balls.length; i++){
        if(balls[i].exists){
            boole = false;
        }
    }
    return boole;
}

function drawScore(){ //draws score on the canvas
    ctx.font = "16px monospace";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Score: ${currentScore}`, 8, 20); //number behind x,y on canvas
}

function drawPower(){ //draws score on the canvas
    ctx.font = "16px monospace";
    ctx.fillStyle = "#000000";
    ctx.fillText(`${powerUp}`, (canvas.width / 2)-15, 20); //number behind x,y on canvas
}

function drawLives(){
    ctx.font = "16px monospace";
    ctx.fillStyle = "#000000";
    ctx.fillText(`Lives: ${player.lives}`, canvas.width-95, 20); //drawn on the other side of the screen
}


function drawAllBricks(){
    for(let c = 0; c < block.columns; c++){
        for(let r = 0; r < block.rows; r++){
            if(bricks[c][r].state == 1){
                var blockX = (c * (block.width + block.padding)) + block.offsetLeft;
                var blockY = (r * (block.height + block.padding)) + block.offsetTop;
                bricks[c][r].x = blockX;
                bricks[c][r].y = blockY;
                bricks[c][r].draw();
            }
        }
    }
}

function collisionDetection(){ //detection for blocks
    for(let ball of balls){
        for(let c = 0; c < block.columns; c++){
            for(let r = 0; r < block.rows; r++){
                var b = bricks[c][r]; //adding a reference to each of the existing blocks
                if (b.state == 1){ //check if the block exists
                    if(ball.x > b.x && ball.x < b.x + block.width && ball.y > b.y && ball.y < b.y + block.height){
                        if(!ball.isSuperBall){
                            ball.dy = -ball.dy; //bounces the ball after collision.
                        }
                        b.state = 0; //set state of the block to 0 so it doesn't get drawn in next frame.
                        /* playerScore += 12;
                        ballColorChanger();
                        effectRandomizer();//testing random effects
                        if(playerScore == (block.rows * block.columns * 12)){
                            //gameover
                            alert("Win!");
                            document.location.reload();
                            clearInterval(interval);
                        } */
                    }
                }
                
            }
        }
    }
}

function allBricksDed() {
    let bool = true;
    for(let c = 0; c < block.columns; c++){
        for(let r = 0; r < block.rows; r++){
            if(bricks[c][r].state == 1){
                bool = false;
            }
        }
    }
    /* for (let brick of bricks) {
      if (brick.state == 1) {
        bool = false;
      }
    } */
    return bool;
  }

function pauseScreen(){
    ctx.font = "30px Verdana";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0"," magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("Game Paused", (canvas.width / 2) - 90, canvas.height / 2);
}

function winScreen(){
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Verdana";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0"," magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("You Win.", (canvas.width / 2) - 90, (canvas.height / 2) - 50);
    pauseGame();
    resetBalls();
}

function endScreen(){
    clearInterval(interval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "30px Verdana";
    // Create gradient
    var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0"," magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");
    // Fill with gradient
    ctx.fillStyle = gradient;
    ctx.fillText("Game Over.", (canvas.width / 2) - 90, (canvas.height / 2) - 50);
    pauseGame();
    resetBalls();
}

function resetBalls(){
    init();
}

function keyUpHandler(e){
    if(e.key == "ArrowRight"){
        rightKey = false;
    } else if(e.key == "ArrowLeft"){
        leftKey = false;
    }
}

function keyDownHandler(e){
    if(e.key == "p") pauseGame();

    if(e.key == " "){
        console.log("ball launched");
        player.launch();
    }

    if(e.key == "ArrowRight"){
        rightKey = true;
    } else if(e.key == "ArrowLeft"){
        leftKey = true;
    }
}

function pauseGame(){
    if(!gamePaused){
        pauseScreen();
        clearInterval(interval);
        gamePaused = true;
    } else if(gamePaused){
        interval = setInterval(draw, 10);
        gamePaused = false;
    }
    
}
