class Ball{
    constructor(x, y, r){
        this.x = x;
        this.y = y; //default position for ball
        this.radius = r;
        this.color = "#000000";
        this.dx = 1;
        this.dy = -3;
        this.speed = 3;
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
            this.y = player.y - (this.radius*1.5);
            this.dy = -this.dy;
            if(this.x > player.x && this.x < player.x + player.width){
                if(this.x + this.radius > player.x && this.x + this.radius < player.x + 20){
                    //bounce left 45degrees
                    
                    this.dx = -this.speed;
                    console.log("left45");
                }
                if(this.x + this.radius > player.x + (player.width/5) && this.x + this.radius < player.x + ((player.width/5)*2)){
                    //bounce left 60degrees
                    //this.dy = -this.dy;
                    this.dx = -this.speed * 0.6;
                    console.log("left60");
                }
                if(this.x > player.x + ((player.width/5)*2) && this.x + this.radius < player.x + ((player.width/5)*3)){ //collision detection with player bar center
                    //this.dy = -this.dy; 
                } 
                if(this.x > player.x + ((player.width/5)*3) && this.x + this.radius < player.x + ((player.width/5)*4)){
                    //bounce right 60degrees
                    //this.dy = -this.dy;
                    this.dx = this.speed * 0.6;
                    console.log("right60");
                }
                if(this.x > player.x + ((player.width/5)*4) && this.x + this.radius < player.x + player.width){
                    //bounce right 45degrees
                    //this.dy = -this.dy;
                    this.dx = this.speed;
                    console.log("right45");
                }
            } else {
                console.log("bottom-out detected");
                this.exists = false; //remove ball from existence
            //deprecated from ver1. end state to be tracked seperately.
            //game end state because ball touches bottom bar. can add lives here.
            }
        }
        this.x += this.dx;
        this.y += this.dy;
    } 
}

