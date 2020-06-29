class Ball{
    constructor(x, y, r){
        this.x = x;
        this.y = y; //default position for ball
        this.radius = r;
        this.color = "#000000";
        this.dx = 5;
        this.dy = -5;
        this.exists = true;
        this.isSuperBall = false;
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2); //draw circle first 2 are position on canvas
        ctx.fillStyle = this.color; //fill color for the above shape
        ctx.fill();
        ctx.closePath();
    }

    move(){
        if(this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius){
            this.dx = -this.dx; //if ball touches left or right "bounce" it by inverting the movement rate
        }
        if(this.y + this.dy < this.radius){
            this.dy = -this.dy; //collision detection with top of the box.
        } else if(this.y + this.dy > canvas.height - this.radius){
            if(this.x > player.x && this.x < player.x + player.width){ //collision detection with player bar
                this.dy = -this.dy;
            } else {
                    console.log("bottom-out detected");
                    this.exists = false; //remove ball from existence
                //deprecated from ver1. end state to be tracked seperately.
                //game end state because ball touches bottom bar. can add lives here.
                /* playerLives--;
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
                } */
            }
        }
        this.x += this.dx;
        this.y += this.dy;
    }
}