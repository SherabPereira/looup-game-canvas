const canvas = document.querySelector("#game-area");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGTH = (canvas.height = 900);
let gameSpeed = 0; // minus go down, plus go up
let gameFrame = 0;
let numberOfPads = 5;
let isGameOver = false;
let platformDeleted = false;
const staggerFrames = 5;

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
const playerSpriteWidth = 165;
const playerSpriteHeight = 164;
const spriteAnimations = [];
let playerAnimationStates = [];

//Characters
let charactersArray = [];

// Functions
function createPads(isMultiplePads) {
  const padWidth = 150;
  const padHeight = 50;
  const gapBetweenPads = CANVAS_HEIGTH / numberOfPads + 30;
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


  if (padsArray.length !== 0 && padsArray !== null) {
    const x = padsArray[0].x + 23;
    const y = padsArray[0].y - 69;
    player = new Player(x, y, playerSpriteWidth, playerSpriteHeight);
    charactersArray.push(player);
  }
}

function createPlayerSpriteAnimations() {
  playerAnimationStates = [
    {
      name: "jumpLeft",
      frames: 6,
    },
    {
      name: "jumpRight",
      frames: 6,
    },
    {
      name: "fallLeft",
      frames: 6,
    },
    {
      name: "fallRight",
      frames: 6,
    },
    {
      name: "moveLeft",
      frames: 6,
    },
    {
      name: "moveRight",
      frames: 6,
    },
  ];

  playerAnimationStates.forEach((state, i) => {
    let frames = {
      loc: [],
    };
    for (let j = 0; j < state.frames; j++) {
      let positionX = j * playerSpriteWidth;
      let positionY = i * playerSpriteHeight;
      frames.loc.push({ x: positionX, y: positionY });
    }
    spriteAnimations[state.name] = frames;
  });

  console.log(spriteAnimations)
}

function gameOver() {
  console.log("over");
  isGameOver = true;
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

  if (platformDeleted) {
    createPads(false);
    platformDeleted = false;
  }
  [...layersArray, ...padsArray, ...charactersArray].forEach((object) => {
    object.draw();
    object.update();
  });

  padsArray = padsArray.filter((object) => {
    if (object.markedToDelete) platformDeleted = true;
    return !object.markedToDelete;
  });

  // //
  // player.draw();
  // //
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
  createPlayerSpriteAnimations();
  createPlayer();
  animate();
});
