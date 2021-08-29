class Hit {
  constructor(x, y, size, isTriggered) {
    this.image = new Image();
    this.image.src =
      "https://origenz.github.io/looup-game-canvas/resources/img/misc/pow.png";
    this.spriteWidth = 200;
    this.spriteHeight = 178;
    this.spriteSheetLength = 5;
    this.x = x;
    this.y = y;
    this.size = size;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "https://origenz.github.io/looup-game-canvas/resources/sound/ded.wav";
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
      if (this.frame === 0) this.sound.play();

      if (gameFrame % 5 === 0) {
        this.frame > 5 ? (this.markedToDelete = true) : this.frame++;
      }
    }
  }
}
