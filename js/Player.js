class Player {
  constructor(x, y, spriteWidth, spriteHeight) {
    this.state = "moveLeft";
    this.image = new Image();
    this.image.src = "../resources/img/sprites/player.png";
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 1.5;
    this.height = this.spriteHeight / 1.5;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.upTimerId = null;
    this.downTimerId = null;
    this.rightTimerId = null;
    this.leftTimerId = null;
    this.alive = true;
    this.position = 0;
    this.frameX = 0;
    this.frameY = 0;
  }

  moveLeft() {
    this.state = "idleLeft";
    clearInterval(this.rightTimerId);
    this.leftTimerId = setInterval(() => {
      //this.state = "moveLeft";
      if (this.x > 0) this.x -= 5;
    }, 35);
  }

  moveRight() {
    this.state = "idleRight";
    clearInterval(this.leftTimerId);
    this.rightTimerId = setInterval(() => {
      if (this.x < CANVAS_WIDTH - this.width) this.x += 5;
    }, 35);
  }

  jump() {
    if (!this.state === "idleLeft") this.state = "idleRight";
    clearInterval(this.downTimerId);
    this.upTimerId = setInterval(() => {
      gameSpeed += 0.4;
      this.y -= 8;
      if (this.y < 500) {
        this.fall();
      }
    }, 35);
  }

  fall() {
    if (this.state === "idleLeft") this.state = "fallLeft";
    if (this.state === "idleLeft") this.state = "fallRight";

    clearInterval(this.upTimerId);
    this.downTimerId = setInterval(() => {
      gameSpeed -= 0.3;
      this.y += 7;
      if (this.y >= CANVAS_HEIGTH) this.die();
    }, 35);
  }

  die() {
    this.y = CANVAS_HEIGTH + this.height;
    gameSpeed = 0;
    this.alive = false;
    clearInterval(this.upTimerId);
    clearInterval(this.downTimerId);
  }

  update() {
    this.position =
      Math.floor(this.frame / 6) % spriteAnimations[this.state].loc.length;

    this.frame++;
    this.frameX = this.spriteWidth * this.position;
    this.frameY = spriteAnimations[this.state].loc[this.position].y;
  }

  draw() {
    ctx.drawImage(
      this.image,
      this.frameX, //sx
      this.frameY, //sy
      // 0,
      // 495,
      this.spriteWidth,
      this.spriteHeight,
      this.x, //dx
      this.y, //dy
      this.width,
      this.height
    );
  }
}
