class Player {
  constructor(x, y, spriteWidth, spriteHeight) {
    this.image = new Image();
    this.image.src = "../resources/img/sprites/player.png";
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.upTimerId = null;
    this.downTimerId = null;
    this.alive = true;

    //                    end  4 <-(3 + (1))-> 1  start
    this.spriteChangeSpeed = Math.floor(Math.random() * 3 + 1);
  }
  moveLeft() {
    this.x -= 15;
  }
  moveRight() {
    this.x += 15;
  }
  jump() {
    clearInterval(this.downTimerId);

    this.upTimerId = setInterval(() => {
      gameSpeed += 0.6;
      this.y -= 8;
      if (this.y < 500) {
        this.fall();
      }
    },35);
  }
  fall() {
    clearInterval(this.upTimerId);
    this.downTimerId = setInterval(() => {
      gameSpeed -= 0.4;
      this.y += 6 ;
      if (this.y >= CANVAS_HEIGTH) {
        //gameOver
        this.y = CANVAS_HEIGTH + this.height;
        gameSpeed = 0;
        this.alive = false;
      }
    }, 35);
  }
  update() {
    // animate sprites
    if (gameFrame % this.spriteChangeSpeed === 0) {
      this.frame > 6 ? (this.frame = 0) : this.frame++;
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}
