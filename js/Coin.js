class Coin {
  constructor(image, sound, x, y, speedModifier, spriteWidth, spriteHeight) {
    this.image = image;
    this.sound = sound;
    this.speedModifier = speedModifier;
    this.speed = 0;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 6;
    this.height = this.spriteHeight / 6;
    this.x = x + this.width;
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

    this.sound.play();
    return true;
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

  update() {
    this.speed = gameSpeed * this.speedModifier;
    this.y = this.y + this.speed;

    if (this.y >= CANVAS_HEIGTH + this.height) this.markedToDelete = true;

    if (gameFrame % 6 === 0) this.frame == 1 ? (this.frame = 9) : this.frame--;
  }
}
