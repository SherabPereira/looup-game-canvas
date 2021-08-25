const canvas = document.querySelector("#game-area");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGTH = (canvas.height = 900);

let gameSpeed = 0;
let gameFrames = 1;
let numberOfPads = 10;
let platformDeleted = false;
let isGameover = false;
let score = 0;

const padSpeedModifier = 2;
const layer1SpeedModifier = 0.5;
const layer2SpeedModifier = 1;

let isLeft = false;
let isRight = false;
let isSpace = false;

//

//Background Layers
const backgroundLayer1 = new Image();

backgroundLayer1.src = "./../resources/img/backgrounds/background.png";
const backgroundLayer2 = new Image();
backgroundLayer2.src = "./../resources/img/backgrounds/cloud-group.png";

const layersArray = [
  new Layer(backgroundLayer1, CANVAS_WIDTH, CANVAS_HEIGTH, layer1SpeedModifier),
  new Layer(backgroundLayer2, CANVAS_WIDTH, CANVAS_HEIGTH, layer2SpeedModifier),
];

// Pads
let padsArray = [];
const padImg1 = new Image();
padImg1.src = "./../resources/img/pads/grass_pad.png";

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
    const x = padsArray[0].x + 45; // hardcoded + 32
    const y = padsArray[0].y - 52; //hardcoded - 69
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
      player.y = pad.y - player.height;
      playerObj.stop();
    }
  }
}

function updateScore() {
  if (gameFrames % 10 === 0) score++;
  ctx.font = "35px Questrian";
  ctx.fillStyle = "#c7b299";
  ctx.strokeStyle = "#FFFFFF";
  ctx.fillText(`Score • ${score}`, 20, 55);
  //define the width of the stroke line
  ctx.lineWidth = 2;
  ctx.strokeText(`Score • ${score}`, 20, 55);
}

function gameOver() {
  isGameOver = true;

  ctx.fillStyle = "#52b3da";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH + 50);

  ctx.textAlign = "center";
  ctx.font = "120px Questrian";
  ctx.lineWidth = 4;
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#88ddf0";

  ctx.fillText(`GAME OVER`, CANVAS_WIDTH / 2, 350);
  ctx.strokeText(`GAME OVER`, CANVAS_WIDTH / 2, 350);

  ctx.font = "80px Questrian";
  ctx.fillText(`Your final score :`, CANVAS_WIDTH / 2, 450);
  ctx.strokeText(`Your final score :`, CANVAS_WIDTH / 2, 450);

  ctx.font = "120px Questrian";

  ctx.fillText(`${score}`, CANVAS_WIDTH / 2, 600);
  ctx.strokeText(`${score}`, CANVAS_WIDTH / 2, 600);

  ctx.textAlign = "start";
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

  if (player.y + player.height > CANVAS_HEIGTH) gameOver();
  if (gameSpeed > 0.2) gameFrames++;
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

  updateScore();

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
