class Bee {
  constructor() {
    this.image = new Image();
    this.image.src = "https://origenz.github.io/looup-game-canvas/resources/img/sprites/bee_enemy.png";
    this.speed = Math.random() * 4 + 1;
    this.spriteWidth = 273;
    this.spriteHeight = 282;
    this.width = this.spriteWidth / 5;
    this.height = this.spriteHeight / 5;
    this.x = CANVAS_WIDTH + 100;
    this.y = Math.random() * (CANVAS_HEIGTH - this.height) - 50;
    this.frame = 0;
    this.spriteChangeSpeed = Math.floor(Math.random() * 2 + 1);
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
  update() {
    if (this.x + this.width < 0) this.markedToDelete = true;

    this.x -= this.speed;
    this.y += this.curve * Math.sin(this.angle) + gameSpeed * 2;
    this.angle += this.angleSpeed;

    if (gameFrame % 3 === 0) {
      this.frame > 11 ? (this.frame = 0) : this.frame++;
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
