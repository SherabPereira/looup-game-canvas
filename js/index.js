// document.addEventListener("DOMContentLoaded", () => {});

const canvas = document.querySelector("#game-area");
const ctx = canvas.getContext("2d");

const CANVAS_WIDTH = (canvas.width = 600);
const CANVAS_HEIGTH = (canvas.height = 800);

let gameSpeed = 5;
let gameFrame = 0;

let numberOfPads = 5;

const backgroundLayer1 = new Image();
backgroundLayer1.src = "../resources/img/backgrounds/background.jpg";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "../resources/img/backgrounds/cloud-group.png";

// Background

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

const layersArray = [
  new Layer(backgroundLayer1, 800, 800, 0.2),
  new Layer(backgroundLayer2, 826, 400, 0.4),
];

// Platforms

const padImg1 = new Image();
padImg1.src = "../resources/img/pads/grass_pad.png";

class Pad {
  constructor(image, x, y, width, height) {
    this.y = y;
    this.x = Math.random() * x;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speed = gameSpeed;
    this.markedToDelete = false;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    this.speed = gameSpeed * 0.6; //Hardcoded speed modifier- change to variable
    this.y = Math.floor(this.y + this.speed);

    if (this.y >= CANVAS_HEIGTH) this.markedToDelete = true;
  }
}

let padsArray = [];

function createPads() {
  const interval = Math.floor(Math.random() * 100 + 50);

  if (gameFrame % interval === 0) {
    for (let i = 0; i < numberOfPads; i++) {
      let padGap = 1000 / numberOfPads;
      let bottom = 100 + i * padGap;
      padsArray.push(new Pad(padImg1, bottom, 0, 70, 20));
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

  createPads();
  [...layersArray, ...padsArray].forEach((object) => {
    object.draw();
    object.update();
  });

  padsArray = padsArray.filter((object) => !object.markedToDelete);

  gameFrame++;

  //console.log(padsArray);

  requestAnimationFrame(animate);
}

animate();
