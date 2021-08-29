class Hit {
  constructor(image, sound, x, y, spriteWidth, spriteHeight, size) {
    this.image = image;
    this.sound = sound;
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.spriteSheetLength = 5;
    this.x = x;
    this.y = y;
    this.size = size;
    this.frame = 0;
    this.markedToDelete = false;
    this.isTriggered = false;
  }

  draw() {
    if (this.isTriggered) {
      ctx.drawImage(
        this.image,
        this.frame * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.size * 1.3,
        this.size * 1.3
      );
    }
  }

  update() {
    if (this.isTriggered) {
      if (gameFrame % 5 === 0) {
        if (this.frame === 0) this.sound.play();
        this.frame > 5 ? (this.markedToDelete = true) : this.frame++;
      }
    }
  }
}
