class Brick {
    constructor(x, y, w, h){
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.state = 1;
        this.color =  Math.floor(Math.random()*16777215).toString(16);
        this.points = 15;
    }

    draw(){
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = `#${this.color}`;
        ctx.fill();
        ctx.closePath();
    }

}