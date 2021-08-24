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
  const gapBetweenPads = CANVAS_HEIGTH / numberOfPads + 30;
  const availableSpace = CANVAS_WIDTH - padWidth;

  if (isMultiplePads) {
    for (let i = 0; i < numberOfPads; i++) {
      let x = Math.ceil(Math.random() * availableSpace);
      let y = i * gapBetweenPads;
      padsArray.unshift(
        new Pad(padImg1, x, y - padHeight, padWidth, padHeight, i)
      );
    }
  } else {
    let x = Math.ceil(Math.random() * availableSpace);
    let y = gapBetweenPads;
    padsArray.unshift(new Pad(padImg1, x, -y - padHeight, padWidth, padHeight));
  }
}

function createPlayer() {
  if (padsArray.length !== 0 && padsArray !== null) {
    const x = padsArray[0].x + 23; // hardcoded
    const y = padsArray[0].y - 69; //hardcoded
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

function movePlayer(event) {
  if (event.key === "ArrowLeft") player.moveLeft();
  if (event.key === "ArrowRight") player.moveRight();
  if (event.key === " ") player.jump();
}

function checkInPlatform(padsArray, playerObj) {
  // if (//enemies
  //   mockPlayer.x < mockPad + mockPad.width &&
  //   mockPlayer.x + mockPlayer.width > mockPad.x &&
  //   mockPlayer.y < mockPad.y + mockPad.height &&
  //   mockPlayer.y + mockPlayer.height > mockPad.y
  // ) {
  //   //collision
  // } else {
  //   //no collision
  // }
  console.log(playerObj.state);
  if (playerObj.state === "fallRight" || playerObj.state === "fallLeft") {
    for (let i = padsArray.length - 1; i > 0; i--) {
      const pad = padsArray[i];

      // padsArray.forEach((pad) => {

      // Player -  ctx.strokeRect(this.x+20,this.y + 20, this.width-40, this.height-40) // test
      // Pad -  ctx.strokeRect(this.x + 5,this.y + 15, this.width - 10, this.height- 20) // test

      const playerBottomLeftX = playerObj.x + 20;
      const playerBottomLeftY = playerObj.y + 20 + (playerObj.height - 40);
      const playerBottomRightX = playerObj.x + 20 + (playerObj.width - 40);
      const playerBottomRightY = playerObj.y + 20 + (playerObj.height - 40);

      const padTopLeftX = pad.x + 5;
      const padTopLeftY = pad.y + 15;
      const padTopRightX = pad.x + 5 + (pad.width - 10);
      const padTopRightY = pad.y + 15;

      if (
        playerBottomLeftX >= padTopLeftX &&
        playerBottomLeftY >= padTopLeftY &&
        playerBottomRightX <= padTopRightX &&
        playerBottomRightY >= padTopRightY
      ) {
       // ctx.fillRect(playerBottomLeftX, playerBottomLeftY, 5, 5); //test
        //ctx.fillRect(playerBottomRightX, playerBottomRightY, 5, 5); //test
       // ctx.fillRect(padTopLeftX, padTopLeftY, 5, 5); //test
       // ctx.fillRect(padTopRightX, padTopRightY, 5, 5); //test

        console.log("stop ");
        playerObj.stop();
      } else {
      }
    }
    // });
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

  checkInPlatform(padsArray, charactersArray[0]);

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
  document.addEventListener("keydown", movePlayer);
  createPads(true);
  createPlayerSpriteAnimations();
  createPlayer();
  animate();
});
