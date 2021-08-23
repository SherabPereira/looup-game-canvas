// const image1 = new Image();
// const image2 = new Image();
// image1.src = "../resources/img/sprites/player/marshmallow_earphone-01.png";
// image2.src = "../resources/img/sprites/player/marshmallow_earphone-02.png";

// const playerState = [
//   { walkLeft: [new Image()] },
//   { walkRight: [image1, image2] },
//   { jumpLeft: [] },
//   { jumpright: [image1, image1, image2] },
// ];

class Player {
  constructor(x, y, width, height) {
    this.image = new Image();
    this.image.src =
      "../resources/img/sprites/player/marshmallow_earphone-01.png";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.x++;
  }
}
