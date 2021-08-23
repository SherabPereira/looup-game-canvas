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
        this.y - this.height,
        this.width,
        this.height
      );
    }
  
    update() {
      this.speed = gameSpeed * this.speedModifier;
      if (this.y >= this.height) this.y = 0;
      this.y = Math.floor(this.y + this.speed);
    }
  }
  