class Ghost {
  constructor() {
    this.image = new Image();
    this.image.src = "../resources/img/sprites/ghost_enemy.png";
    this.speed = Math.random() * 3 + 1;
    this.spriteWidth = 160;
    this.spriteHeight = 237.5;
    this.width = this.spriteWidth / 4;
    this.height = this.spriteHeight / 4;
    this.x = Math.random() * (canvas.width - this.width);
    this.y = -this.height;
    this.newX = (Math.random() * canvas.width) / 2;
    this.newY = (Math.random() * canvas.height) / 2;
    this.frame = 0;
    this.spriteChangeSpeed = Math.floor(Math.random() * 2 + 1);
    this.interval = Math.floor(Math.random() * 250 + 250);
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
    if (this.y + this.height > CANVAS_WIDTH) this.markedToDelete = true;

    if (gameFrame % this.interval === 0) {
      this.newX = Math.random() * (canvas.width - this.width);
      this.newY = Math.random() * (canvas.height - this.height);
    }

    let dx = this.x - this.newX;
    let dy = this.y - this.newY;

    this.x -= dx / 100;
    this.y -= dy / 100 - gameSpeed * 2;

    if (gameFrame % 5 === 0) {
      this.frame > 9 ? (this.frame = 0) : this.frame++;
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
