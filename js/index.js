const canvas = document.querySelector("#game-area");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGTH = (canvas.height = 900);
let gameSpeed = 0; // minus go down, plus go up
let gameFrame = 0;
let numberOfPads = 10;
let isGameOver = false;
let platformDeleted = false;
const padSpeedModifier = 2;
const layer1SpeedModifier = 0.5;
const layer2SpeedModifier = 1;

let isLeft = false;
let isRight = false;
let isSpace = false;

//

//Background Layers
const backgroundLayer1 = new Image();
backgroundLayer1.src = "../resources/img/backgrounds/background.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "../resources/img/backgrounds/cloud-group.png";

const layersArray = [
  new Layer(backgroundLayer1, CANVAS_WIDTH, CANVAS_HEIGTH, layer1SpeedModifier),
  new Layer(backgroundLayer2, CANVAS_WIDTH, CANVAS_HEIGTH, layer2SpeedModifier),
];

// Pads
let padsArray = [];
const padImg1 = new Image();
padImg1.src = "../resources/img/pads/grass_pad.png";

//Player
let player = null;
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
  const gapBetweenPads = (CANVAS_HEIGTH + 70) / numberOfPads;
  const availableSpace = CANVAS_WIDTH - padWidth;

  if (isMultiplePads) {
    for (let i = 0; i < numberOfPads; i++) {
      let x = Math.ceil(Math.random() * availableSpace);
      let y = i * gapBetweenPads;
      padsArray.unshift(
        new Pad(
          padImg1,
          x,
          y - padHeight,
          padWidth,
          padHeight,
          padSpeedModifier
        )
      );
    }
  } else {
    let x = Math.ceil(Math.random() * availableSpace);
    let y = gapBetweenPads;
    padsArray.push(
      new Pad(padImg1, x, -y - padHeight, padWidth, padHeight, padSpeedModifier)
    );
  }
}

function createPlayer() {
  if (padsArray.length !== 0 && padsArray !== null) {
    const x = padsArray[0].x + 32; // hardcoded + 32
    const y = padsArray[0].y - 100; //hardcoded - 69
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

  console.log(spriteAnimations);
}

function keyDown(event) {
  if (event.key === "ArrowLeft") {
    isLeft = true;
    player.moveLeft();
  }
  if (event.key === "ArrowRight") {
    isRight = true;
    player.moveRight();
  }
  if (event.key === " ") isSpace = true;
}

function keyUp(event) {
  if (event.key === " ") isSpace = false;
  if (event.key === "ArrowLeft") isLeft = false;
  if (event.key === "ArrowRight") isRight = false;
}

function checkInPlatform(padsArray, playerObj) {
  for (let i = 0; i < padsArray.length; i++) {
    const pad = padsArray[i];

    if (
      playerObj.isColliding(pad) &&
      player.y + player.height < pad.y + player.vy
    ) {
      player.y = pad.y - player.height ;
      console.log("stop ");
      playerObj.stop();
    }
  }
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

  checkInPlatform(padsArray, player);

  [...layersArray, ...padsArray, ...charactersArray].forEach((object) => {
    object.draw();
    object.update();
  });

  padsArray = padsArray.filter((object) => {
    if (object.markedToDelete) platformDeleted = true;
    return !object.markedToDelete;
  });

  gameFrame++;
  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);
  createPads(true);
  createPlayerSpriteAnimations();
  createPlayer();
  animate();
});
