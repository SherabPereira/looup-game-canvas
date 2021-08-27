class Pad {
  constructor(image, x, y, width, height, speedModifier) {
    this.y = y;
    this.x = Math.random() * x;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speed = gameSpeed;
    this.speedModifier = speedModifier;
    this.markedToDelete = false;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y - 18, this.width, this.height);
  }

  update() {
    this.speed = gameSpeed * this.speedModifier;
    this.y = this.y + this.speed;

    if (this.y >= CANVAS_HEIGTH + this.height) {
      this.markedToDelete = true;
    }
  }
}
