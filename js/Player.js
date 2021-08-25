class Player {
  constructor(x, y, spriteWidth, spriteHeight) {
    this.state = "moveRight";
    this.image = new Image();
    this.image.src = "../resources/img/sprites/player.png";
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 1.5 - 50;
    this.height = this.spriteHeight / 1.5 - 57;
    this.x = x + 25;
    this.y = y + 28;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 20;
    this.weight = 0.1;
    this.frame = 0;
    this.framePosition = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.rightTimerId = null;
    this.leftTimerId = null;
    this.alive = true;
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

    if (this.vx > 0) player.vx = -3;

    isLeft = true;
    isRight = false;
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
    if (this.vx < CANVAS_WIDTH - this.width) player.vx = 3;

    isRight = true;
    isLeft = false;
  }

  // jump() {
  //   //   if (this.stopped) return;
  //   //   this.stopped = true;

  //   if (isSpace && this.vy === 0) {
  //     if (this.state == "moveLeft") this.state = "jumpLeft";
  //     if (this.state == "moveRight") this.state = "jumpRight";
  //     this.vy = -5;
  //   }

  //   clearInterval(this.downTimerId);
  //   this.upTimerId = setInterval(() => {
  //     gameSpeed += 0.4;
  //     this.y -= 10 ;
  //     if (this.y < 400) {
  //       this.fall();
  //     }
  //   }, 50);
  // }

  // fall() {

  //   clearInterval(this.upTimerId);
  //   this.downTimerId = setInterval(() => {
  //     gameSpeed -= 0.02;
  //     this.y += 10;
  //     if (this.y >= CANVAS_HEIGTH) this.die();
  //   }, 35);
  // }

  jump() {
    if (!isLeft && !isRight) this.vx = 0;

    if (isSpace && this.vy === 0) {
      if (this.state == "moveLeft") this.state = "jumpLeft";
      if (this.state == "moveRight") this.state = "jumpRight";
      this.vy = -6.9;
    }

    if (!isSpace && this.vy !== 0) {
      if (this.state === "jumpLeft" || this.state === "moveLeft")
        this.state = "fallLeft";
      if (this.state === "jumpRight" || this.state === "moveRight")
        this.state = "fallRight";
    }

    if (this.vy < this.gravity) this.vy += this.weight;
  }

  die() {
    this.y = CANVAS_HEIGTH + this.height;
    gameSpeed = 0;
    this.alive = false;
  }

  stop() {
    gameSpeed = 0;
    this.vy = 0;

    if (this.state === "fallRight") this.state = "moveRight";
    if (this.state === "fallLeft") this.state = "moveLeft";
  }

  isColliding(obj) {
    if (
      this.x > obj.x + obj.width ||
      this.x + this.width < obj.x ||
      this.y > obj.y + obj.height ||
      this.y + this.height < obj.y
    ) {
      return false;
    }

    return true;
  }

  draw() {
    ////
    ctx.strokeRect(this.x, this.y, this.width, this.height); // test
    ////
    ctx.drawImage(
      this.image,
      this.frameX + 25, //sx
      this.frameY + 25, //sy
      this.spriteWidth - 50,
      this.spriteHeight - 60,
      this.x, //dx
      this.y, //dy
      this.width,
      this.height
    );
  }

  update() {
    console.log(this.state);

    this.x += player.vx;
    this.y += player.vy;

    this.jump();

    console.log(this.framePosition, this.state);
    this.framePosition =
      Math.floor(this.frame / 6) % spriteAnimations[this.state].loc.length;

    this.frame++;
    this.frameX = this.spriteWidth * this.framePosition;
    this.frameY = spriteAnimations[this.state].loc[this.framePosition].y;
  }
}
