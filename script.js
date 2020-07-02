/* Version 2 by Darrell */
var canvas = document.getElementById("breakoutCanvas");
var ctx = canvas.getContext("2d");
var interval;
//------------------------global vars----------------------------------

var gamePaused = false;

var powerUp = "";
var isPaddleUp = false;
var isMultiBall = false;
var currentScore = 0;
var roundsWon = 0;
var hiScore = 0;
var playerHeight = 10;
var playerWidth = 75;
var playerUpWidth = 150;
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
var level = ['O####M','UO###M','UUO##M','UUUO#M','UUUUOM','UUUO#M','UUO##M','UO###M'];
//['########','OOOOOOOO','OOOOOOOO','########','########']
var ballRadius = 10;
var balls;
var ballLaunched = false;
var ballsFired = 0;

var roundsText = document.querySelector('.titleRight');
var hiScoreDiv = document.querySelector('.titleLeft');
var pee = document.createElement('p');
var peePee = document.createElement('p');
pee.textContent = 'Rounds Won: 0';
peePee.textContent = 'Hi-Score: 0';
roundsText.appendChild(pee);
hiScoreDiv.appendChild(peePee);

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

player = new PaddlePop(playerX, canvas.height - playerHeight, playerWidth, playerHeight);

//all functions that need to be loaded at game start
function init(){
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
        if(isPaddleUp){ //keep increasing player width until target reached
            if(player.width < playerUpWidth){
                player.width ++;
            }
        } else {
            if(player.width != 75){
                player.width--;
            }
        }
        player.draw(); //draw and animate paddle
        player.move();
        drawScore();
        drawPower();
        drawLives();
        //----balls--------
        superColor(Math.floor(Math.random()*16777215).toString(16));
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
                endScreen();
            } else {
                player.lives--;
                ballLaunched = false;
                //allow one more ball to be launched
            }
        }
    }

}

function effectRandomizer(){
    let effect = Math.floor(Math.random() * 10); //for random effect
    if(effect > 5 && effect < 8){
        //activate superball
        superBall();
    }
    if(effect >= 8 && effect < 10){
        paddleUp();
    }
    if(effect > 3 && effect <= 5){
        multiBall();
    }
    
}

function superColor(color){
    for(ball of balls){
        if(ball.isSuperBall){
            ball.color = `#${color}`;
        } else {
            ball.color = "#000000";
        }
    }
}

var superBallTimer;
function superBall(){
    for(ball of balls){
        if(!ball.isSuperBall){
            ball.isSuperBall = true;
            powerUp = "Super Ball!";
            superBallTimer = setTimeout(resetSuper=>{
                ball.isSuperBall = false;
                powerUp = "";
            },7000);
        } else { //extends superball duration if triggered while active
            clearTimeout(superBallTimer);
            superBallTimer = setTimeout(resetSuper=>{
                ball.isSuperBall = false;
                powerUp = "";
            },3000);
        }
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

var multiBallTimer;
function multiBall(){
    if(!isMultiBall){
        isMultiBall = true;
        powerUp = "Multi Ball!"
        multiBallTimer = setTimeout(resetPaddle=>{
            isMultiBall = false;
            powerUp = "";
            ballsFired = 0;
        },10000);
    } else {
        clearTimeout(multiBallTimer);
        ballsFired = 0;
        multiBallTimer = setTimeout(resetPaddle=>{
            isMultiBall = false;
            powerUp = "";
            ballsFired = 0;
        },3000);
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
    for(let i = 0; i < balls.length; i++){
        if(balls[i].exists){
            return false;
        }
    }
    return true;
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
            if(bricks[c][r].state > 0){
                var blockX = (c * (block.width + block.padding)) + block.offsetLeft;
                var blockY = (r * (block.height + block.padding)) + block.offsetTop;
                bricks[c][r].x = blockX;
                bricks[c][r].y = blockY;
                bricks[c][r].draw();
            }
        }
    }
}

function ballsLaunchedChecker(){
    if(ballsFired < 5){
        ballsFired++;
        return true;
    } else {
        return false;
    }
}

function collisionDetection(){ //detection for blocks
    for(let ball of balls){
        for(let c = 0; c < block.columns; c++){
            for(let r = 0; r < block.rows; r++){
                var b = bricks[c][r]; //adding a reference to each of the existing blocks
                if (b.state != 0){ //check if the block exists
                    if(ball.x > b.x && ball.x < b.x + block.width && ball.y > b.y && ball.y < b.y + block.height){
                        if(!ball.isSuperBall){
                            ball.dy = -ball.dy; //bounces the ball after collision.
                        }
                        b.state -= 1; //set state of the block to 0 so it doesn't get drawn in next frame.
                        currentScore += b.points;
                        //ballColorChanger();
                        effectRandomizer();//testing random effects
                        // if(playerScore == (block.rows * block.columns * 12)){
                        //     //gameover
                        //     alert("Win!");
                        //     document.location.reload();
                        //     clearInterval(interval);
                        // }
                    }
                }
                
            }
        }
    }
}

function allBricksDed() {
    for(let c = 0; c < block.columns; c++){
        for(let r = 0; r < block.rows; r++){
            if(bricks[c][r].state > 0){
                return false;
            }
        }
    }
    return true;
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
    ctx.fillText("Press P to continue.", (canvas.width / 2) - 130, canvas.height / 2);
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
    ctx.fillText("Round Cleared.", (canvas.width / 2) - 80, (canvas.height / 2) - 50);
    roundsWon += 1;
    pee.textContent = `Rounds Won: ${roundsWon}`;
    updateHiScore();
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
    updateHiScore();
    currentScore = 0;//reset score and lives
    roundsWon = 0;
    player.lives = 3;
    pee.textContent = `Rounds Won: ${roundsWon}`;
    pauseGame();
    resetBalls();
    
}

function resetBalls(){
    ballLaunched = false;
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

function updateHiScore(){
    if(hiScore < currentScore){
        hiScore = currentScore;
        peePee.textContent = `Hi-Score: ${hiScore}`;
    }
}
/* function brickLoader(brickArr, c, r){ //broken. work in progress
    var brickString = brickArr.join('');
    for(let i = 0; i < brickString.length; i++){
        if(brickString.charAt(i) == '#'){
            bricks[c][r].state = 1;
        }
        if(brickString.charAt(i) == 'O'){
            bricks[c][r].state = 0;
        }
        if(brickString.charAt(i) == 'U'){
            bricks[c][r].state = 2;
        }
        if(brickString.charAt(i) == 'M'){
            bricks[c][r].state = 3;
        }
    }
} */

