class Coin {
  constructor(x, y, speedModifier) {
    this.image = new Image();
    // this.image.src =
    //   "https://origenz.github.io/looup-game-canvas/resources/img/misc/bitcoin.png";
    this.image.src = "../resources/img/misc/bitcoin.png";
    this.sound = new Audio();
    this.sound.src = "../resources/sound/coin.wav";
    this.speedModifier = speedModifier;
    this.speed = 0;
    this.spriteWidth = 291;
    this.spriteHeight = 278;
    this.width = this.spriteWidth / 6;
    this.height = this.spriteHeight / 6;
    this.x = x + this.width ;
    this.y = y - this.height;
    this.frame = 9;
    this.markedToDelete = false;
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

  update() {
    this.speed = gameSpeed * this.speedModifier;
    this.y = this.y + this.speed;

    if (this.y >= CANVAS_HEIGTH + this.height) this.markedToDelete = true;

    if (gameFrame % 6 === 0) this.frame == 1 ? (this.frame = 9) : this.frame--;
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
