class Player {
  constructor(x, y, spriteWidth, spriteHeight) {
    this.state = "moveRight";
    this.image = new Image();
    this.image.src =
      "https://origenz.github.io/looup-game-canvas/resources/img/sprites/player.png";
    this.jumpSound = new Audio();
    this.jumpSound.src =
      "https://origenz.github.io/looup-game-canvas/resources/sound/jump.mp3";
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 2.78;
    this.height = this.spriteHeight / 3.15;
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.gravity = 15;
    this.weight = 0.19;
    this.frame = 0;
    this.framePosition = 0;
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

    if (this.x > 0) player.vx = -3;
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

    if (this.x < CANVAS_WIDTH) player.vx = 3;
  }

  jumpFall() {
    gameSpeed -= this.vy / 60;

    if (!isLeft && !isRight) this.vx = 0;

    if (isSpace && this.vy === 0) {
      this.jumpSound.play();
      this.jumpSound.currentTime = 0.004;
      if (this.state == "moveLeft") this.state = "jumpLeft";
      if (this.state == "moveRight") this.state = "jumpRight";

      this.vy = -7.5;
    }
    if (!isSpace && this.vy !== 0) {
      if (this.state === "jumpLeft" || this.state === "moveLeft")
        this.state = "fallLeft";
      if (this.state === "jumpRight" || this.state === "moveRight")
        this.state = "fallRight";
    }
    if (this.vy < this.gravity) this.vy += this.weight;
  }

  stop() {
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
    this.x += player.vx;
    this.y += player.vy;

    this.jumpFall();

    this.framePosition =
      Math.floor(this.frame / 6) % spriteAnimations[this.state].loc.length;

    this.frameX = this.spriteWidth * this.framePosition;
    this.frameY = spriteAnimations[this.state].loc[this.framePosition].y;

    this.frame++;
  }
}
