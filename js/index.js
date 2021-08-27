const canvas = document.querySelector("#game-area");
const ctx = canvas.getContext("2d");
const scoreCtx = document.querySelector("#score").getContext("2d");
const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGTH = (canvas.height = 900);

let gameSpeed = 0;
let numberOfPads = 9;
let platformDeleted = false;
let isGameover = false;
let score = 0;
let upFrames = 0;
let gameFrame = 0;

const padSpeedModifier = 1.7;
const layer1SpeedModifier = 0.5;
const layer2SpeedModifier = 1;

let isLeft = false;
let isRight = false;
let isSpace = false;

let enemiesOneIntervalId = null;
let enemiesTwoIntervalId = null;

//

//Background Layers
const backgroundLayer1 = new Image();
backgroundLayer1.src =
  "https://origenz.github.io/looup-game-canvas/resources/img/backgrounds/background.png";

const backgroundLayer2 = new Image();
backgroundLayer2.src =
  "https://origenz.github.io/looup-game-canvas/resources/img/backgrounds/cloud-group.png";

const layersArray = [
  new Layer(backgroundLayer1, CANVAS_WIDTH, CANVAS_HEIGTH, layer1SpeedModifier),
  new Layer(backgroundLayer2, CANVAS_WIDTH, CANVAS_HEIGTH, layer2SpeedModifier),
];

// Sound and SFX
const gameTheme = new sound(
  "https://origenz.github.io/looup-game-canvas/resources/sound/gameMusic.mp3"
);

// Pads
let padsArray = [];
const padImg1 = new Image();
padImg1.src =
  "https://origenz.github.io/looup-game-canvas/resources/img/pads/grass_pad.png";

//Player
let player = null;
const playerSpriteWidth = 165;
const playerSpriteHeight = 164;
const spriteAnimations = [];
let playerAnimationStates = [];

//Enemies
let enemiesArray = [];

//Hits
let hitsArray = [];

// Functions
function createPads(isMultiplePads) {
  const padWidth = 150;
  const padHeight = 50;
  const gapBetweenPads = (CANVAS_HEIGTH + 70) / numberOfPads;
  const availableSpace = CANVAS_WIDTH - padWidth;

  if (isMultiplePads) {
    for (let i = 0; i < numberOfPads; i++) {
      let x = Math.round(Math.random() * availableSpace);
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
    const x = padsArray[0].x + 45; // hardcoded
    const y = padsArray[0].y - 52; //hardcoded
    player = new Player(x, y, playerSpriteWidth, playerSpriteHeight);
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

function createEnemies() {
  enemiesOneIntervalId = setInterval(() => {
    enemiesArray.push(new Bee());
  }, 4800);
  enemiesTwoIntervalId = setInterval(() => {
    enemiesArray.push(new Ghost());
  }, 7000);
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
  if (event.key === " ") {
    playJumpSound();
    isSpace = true;
  }
}

function playJumpSound() {
  if (player.vy < 0.5) {
    const jumpSound = new Audio();
    jumpSound.src = "https://origenz.github.io/looup-game-canvas/resources/sound/jump.mp3";
    jumpSound.play();
  }
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
      player.y + player.height < pad.y + (player.vy - 0.01)
    ) {
      player.y = pad.y - player.height;
      playerObj.stop();
    }
  }
}

function checkEnemyCollisions(enemiesArray, playerObj) {
  enemiesArray.forEach((enemy) => {
    if (enemy.isColliding(playerObj)) {
      hitsArray.push(new Hits(playerObj.x, playerObj.y, playerObj.width));
      isGameover = true;
      player.y = CANVAS_HEIGTH;
      player.x = CANVAS_WIDTH;
      clearInterval(enemiesOneIntervalId);
      clearInterval(enemiesTwoIntervalId);
    }
  });
}

function updateScore() {
  scoreCtx.font = "35px Questrian";
  scoreCtx.fillStyle = "#4ea640";
  scoreCtx.strokeStyle = "#FFFFFF";
  scoreCtx.fillText(`Score • ${score}`, 20, 55);

  scoreCtx.lineWidth = 2;
  scoreCtx.strokeText(`Score • ${score}`, 20, 55);
}

function gameOver() {
  canvas.style.zIndex = "1";

  ctx.fillStyle = "#52b3da";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH + 50);

  ctx.textAlign = "center";
  ctx.font = "120px Questrian";
  ctx.lineWidth = 4;
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#88ddf0";

  ctx.fillText(`GAME OVER`, CANVAS_WIDTH / 2, 350);
  ctx.strokeText(`GAME OVER`, CANVAS_WIDTH / 2, 350);

  ctx.font = "78px Questrian";
  ctx.fillText(`Your final score is`, CANVAS_WIDTH / 2, 450);
  ctx.strokeText(`Your final score is`, CANVAS_WIDTH / 2, 450);

  ctx.font = "120px Questrian";

  ctx.fillText(`${score}`, CANVAS_WIDTH / 2, 600);
  ctx.strokeText(`${score}`, CANVAS_WIDTH / 2, 600);

  ctx.textAlign = "start";
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.preload = "auto";
  this.sound.controls = "none";
  this.sound.style.display = "none";
  this.sound.loop = true;
  this.sound.muted = true;
  document.body.appendChild(this.sound);

  this.play = function () {
    this.sound.play();
    this.sound.muted = false;
  };
  this.pause = function () {
    this.sound.pause();
  };
  this.stop = function () {
    this.sound.pause();
    this.sound.currentTime = 0;
  };
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);
  scoreCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

  if (player.y + player.height > CANVAS_HEIGTH || isGameover) gameOver();

  if (gameSpeed > 0.3) {
    upFrames++;
    score += Math.ceil((upFrames % 2) / 2);
  }

  checkEnemyCollisions(enemiesArray, player);
  checkInPlatform(padsArray, player);

  if (platformDeleted) {
    createPads(false);
    platformDeleted = false;
  }

  [...layersArray, ...padsArray, player, ...enemiesArray, ...hitsArray].forEach(
    (object) => {
      object.draw();
      object.update();
    }
  );

  padsArray = padsArray.filter((pad) => {
    if (pad.markedToDelete) platformDeleted = true;
    return !pad.markedToDelete;
  });

  enemiesArray = enemiesArray.filter((enemy) => {
    return !enemy.markedToDelete;
  });

  if (!isGameover) updateScore();
  gameFrame++;

  requestAnimationFrame(animate);
}

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keydown", keyDown);
  document.addEventListener("keyup", keyUp);

  document
    .querySelector(".on")
    .addEventListener("click", () => gameTheme.play());
  document
    .querySelector(".off")
    .addEventListener("click", () => gameTheme.pause());

  createPads(true);
  createPlayerSpriteAnimations();
  createPlayer();
  createEnemies();
  animate();
});
