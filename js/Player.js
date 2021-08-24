class Player {
  constructor(x, y, spriteWidth, spriteHeight) {
    this.state = "moveRight";
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
    if (this.state === "jumpRight") {
      this.state = "jumpLeft";
    } else if (
      this.state !== "jumpLeft" &&
      this.state !== "fallLeft" &&
      this.state !== "fallRight"
    ) {
      this.state = "moveLeft";
    } else if (this.state === "fallRight") {
      this.state = "fallLeft";
    }

    clearInterval(this.rightTimerId);
    this.leftTimerId = setInterval(() => {
      if (this.x > 0) this.x -= 5;
    }, 35);
  }

  moveRight() {
    if (this.state === "jumpLeft") {
      this.state = "jumpRight";
    } else if (this.state === "fallLeft") {
      this.state = "fallRight";
    } else if (
      this.state !== "jumpRight" &&
      this.state !== "fallRight" &&
      this.state !== "fallLeft"
    ) {
      this.state = "moveRight";
    }

    clearInterval(this.leftTimerId);
    this.rightTimerId = setInterval(() => {
      if (this.x < CANVAS_WIDTH - this.width) this.x += 5;
    }, 35);
  }

  jump() {
    console.log(this.state);
    if (this.state == "moveLeft") this.state = "jumpLeft";
    if (this.state == "moveRight") this.state = "jumpRight";

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
    if (this.state === "jumpLeft" || this.state === "moveLeft")
      this.state = "fallLeft";
    if (this.state === "jumpRight" || this.state === "moveRight")
      this.state = "fallRight";

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
