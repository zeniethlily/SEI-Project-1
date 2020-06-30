class PaddlePop {
    constructor(x, y, w, h){
        this.x = x;
        this.y = y; //default position for player
        this.width = w; //size of paddle
        this.height = h;
        this.lives = 3;
        this.color = "#000000";
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    move(){ //collision detection code
        if(leftKey && this.x > 0){ //collision detection for player otherwise it keeps clipping into box
            this.x -= 7; //player movement speed left
            
        } else if(rightKey && this.x < canvas.width - this.width){ 
            this.x += 7;  //player movement speed right
            if (this.x + this.width > canvas.width){
                this.x = canvas.width - this.width;
            }
        }
    }

    launch(){ //code to launch ball, will add validation to check total number.
        if(!ballLaunched){
            balls.push(new Ball(this.x, this.y, ballRadius)); //this creates ball
            ballLaunched = true;
        }
    }
}