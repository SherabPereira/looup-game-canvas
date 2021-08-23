class Player {
  constructor(x, y, spriteWidth, spriteHeight) {
    this.image = new Image();
    this.image.src = "../resources/img/sprites/player.png";
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.width = this.spriteWidth / 2.5;
    this.height = this.spriteHeight / 2.5;
    this.x = x;
    this.y = y;
    this.frame = 0;
    //                    end  4 <-(3 + (1))-> 1  start
    this.spriteChangeSpeed = Math.floor(Math.random() * 3 + 1);
  }
  moveLeft() {}
  moveRight() {}
  jump() {
    this.y -= 2;
  }
  update() {
    this.x++;
    this.y++;
    // animate sprites
    if (gameFrame % this.spriteChangeSpeed === 0) {
      this.frame > 6 ? (this.frame = 0) : this.frame++;
    }
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
