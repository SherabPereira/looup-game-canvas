class Bee {
  constructor(image, spriteWidth, spriteHeight) {
    this.image = image;
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 5;
    this.height = this.spriteHeight / 5;
    this.x = CANVAS_WIDTH + 100;
    this.y = Math.random() * (CANVAS_HEIGTH - this.height) - 50;
    this.frame = 0;
    this.angle = 0;
    this.angleSpeed = Math.random() * 0.2;
    this.curve = Math.random() * 5;
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
    this.x -= this.speed;
    this.y += this.curve * Math.sin(this.angle) + gameSpeed * 1.5;
    this.angle += this.angleSpeed;

    if (this.x + this.width < 0) this.markedToDelete = true;
    this.frame === 11 ? (this.frame = 0) : this.frame++;
  }
}
