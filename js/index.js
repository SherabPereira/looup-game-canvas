const canvas = document.querySelector("#game-area");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = (canvas.width = 900);
const CANVAS_HEIGTH = (canvas.height = 900);
let gameSpeed = 10; // minus go down, plus go up
let gameFrame = 0;
let numberOfPads = 0;
let isGameOver = false;

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
const padImg1 = new Image();
padImg1.src = "../resources/img/pads/grass_pad_2.png";
let padsArray = [];

// Functions
function createPads() {
  const interval = Math.floor(Math.random() * 200 + 50);
  const padWidth = 150;
  const padHeight = 50;
  const gapBetweenPads = CANVAS_HEIGTH / numberOfPads;
  if (gameFrame % interval === 0) {
    for (let i = 0; i < numberOfPads; i++) {
      // random x position
      let x = Math.random() * (CANVAS_WIDTH - padWidth);
      // vertical gap between pads
      let y = i * gapBetweenPads;
      padsArray.push(new Pad(padImg1, x, y, padWidth, padHeight));
    }
  }
}

//Player

const player = new Player(CANVAS_WIDTH / 2 - 40, CANVAS_HEIGTH - 200, 243, 243);

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH);

  createPads();
  [...layersArray, ...padsArray].forEach((object) => {
    object.draw();
    object.update();
  });
  padsArray = padsArray.filter((object) => !object.markedToDelete);

  //
  player.draw();
  //

  //movePlatforms()

  gameFrame++;
  requestAnimationFrame(animate);
}


function movePlatforms(){
  if(player.y < 700){
    padsArray.forEach( pad =>{
      pad.y -= 4;
    })
  }
}


document.addEventListener("DOMContentLoaded", () => {
  animate();
});
