const canvas = document.querySelector("#game-area");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGTH = (canvas.height = 900);
let gameSpeed = 0; // minus go down, plus go up
let gameFrame = 0;
let numberOfPads = 5;
let isGameOver = false;
let platformDeleted = false;

//Background Layers
const backgroundLayer1 = new Image();
backgroundLayer1.src = "../resources/img/backgrounds/background.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "../resources/img/backgrounds/cloud-group.png";

const layersArray = [
  new Layer(backgroundLayer1, CANVAS_WIDTH, CANVAS_HEIGTH, 0.2),
  new Layer(backgroundLayer2, CANVAS_WIDTH, CANVAS_HEIGTH, 0.4),
];

// Pads
let padsArray = [];
const padImg1 = new Image();
padImg1.src = "../resources/img/pads/grass_pad.png";

//Player
let player = null; //hardcoded min y pos (2nd arg)

// Functions
function createPads(isMultiplePads) {
  const padWidth = 150;
  const padHeight = 50;
  const gapBetweenPads = CANVAS_HEIGTH / numberOfPads;
  const availableSpace = CANVAS_WIDTH - padWidth;

  if (isMultiplePads) {
    for (let i = 0; i < numberOfPads; i++) {
      let x = Math.ceil(Math.random() * availableSpace);
      let y = i * gapBetweenPads;
      padsArray.unshift(
        new Pad(padImg1, x, y - padHeight, padWidth, padHeight)
      );
    }
  } else {
    let x = Math.ceil(Math.random() * availableSpace);
    let y = gapBetweenPads;
    padsArray.push(new Pad(padImg1, x, -y - padHeight, padWidth, padHeight));
  }
}

function createPlayer() {
  const playerWidth = 243;
  const playerHeight = 243;

  if (padsArray.length !== 0 && padsArray !== null) {
    const x = padsArray[0].x + 25;
    const y = padsArray[0].y - 57;
    player = new Player(x, y, playerWidth, playerHeight);
  }
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

  if (platformDeleted) {
    createPads(false);
    platformDeleted = false;
  }
  [...layersArray, ...padsArray].forEach((object) => {
    object.draw();
    object.update();
  });

  padsArray = padsArray.filter((object) => {
    if (object.markedToDelete) platformDeleted = true;
    return !object.markedToDelete;
  });

  //
  player.draw();
  //
  gameFrame++;
  requestAnimationFrame(animate);
}

function movePlayer(event) {
  if (event.key === "ArrowLeft") player.moveLeft();
  if (event.key === "ArrowRight") player.moveRight();
  if (event.key === " ") player.jump();
  // if (event.key === "ArrowDown") player.fall();
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", movePlayer);
  createPads(true);
  createPlayer();
  animate();
});
