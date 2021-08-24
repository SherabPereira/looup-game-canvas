class Layer {
  constructor(image, width, height, speedModifier) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speedModifier = speedModifier;
    this.speed = gameSpeed * this.speedModifier;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.x,
      this.y - this.height + 1,
      this.width,
      this.height
    );
  }

  update() {
    this.speed = gameSpeed * this.speedModifier;
    if (this.y >= this.height) this.y = 0;
    this.y = this.y + this.speed;
  }
}
