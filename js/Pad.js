class Pad {
  constructor(image, x, y, width, height, name) {
    this.y = y;
    this.x = Math.random() * x;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speed = gameSpeed;
    this.markedToDelete = false;
  }

  draw() {
    ///
    ctx.strokeRect(this.x, this.y, this.width, this.height); // test
    ////

    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.speed = gameSpeed * 0.6; //Hardcoded speed modifier- change to variable
    this.y = this.y + this.speed;

    if (this.y >= CANVAS_HEIGTH) this.markedToDelete = true;
  }
}
