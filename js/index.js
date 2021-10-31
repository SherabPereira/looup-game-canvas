const modals = document.querySelectorAll('[data-modal]')
const canvas = document.querySelector('#game-area')
const ctx = canvas.getContext('2d')
const scoreCtx = document.querySelector('#score').getContext('2d')
const CANVAS_WIDTH = (canvas.width = 900)
const CANVAS_HEIGTH = (canvas.height = 900)

let gameSpeed = 0
let numberOfPads = 13
let padDeleted = false
let isGameover = false
let score = 0
let upFrames = 0
let gameFrame = 0

const padSpeedModifier = 1.5
const coinSpeedModifier = padSpeedModifier
const layer1SpeedModifier = 0.6
const layer2SpeedModifier = 1

let isLeft = false
let isRight = false
let isSpace = false

let enemiesOneIntervalId = null
let enemiesTwoIntervalId = null

/***** IMAGES *****/

const backgroundLayer1 = new Image()
backgroundLayer1.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/backgrounds/background.png'

const backgroundLayer2 = new Image()
backgroundLayer2.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/backgrounds/cloud-group.png'

const layersArray = [
  new Layer(backgroundLayer1, CANVAS_WIDTH, CANVAS_HEIGTH, layer1SpeedModifier),
  new Layer(backgroundLayer2, CANVAS_WIDTH, CANVAS_HEIGTH, layer2SpeedModifier),
]
//
const playerImage = new Image()
playerImage.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/sprites/player.png'
//
const padImg1 = new Image()
padImg1.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/pads/grass_pad.png'

//
const beeImage = new Image()
beeImage.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/sprites/bee_enemy.png'

const ghostImage = new Image()
ghostImage.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/sprites/ghost_enemy.png'

//
const hitImage = new Image()
hitImage.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/misc/pow.png'
//
const coinImage = new Image()
coinImage.src =
  'https://origenz.github.io/looup-game-canvas/resources/img/misc/bitcoin.png'
//

/****  SOUND AND SFX ****/

const gameTheme = new Sound(
  'https://origenz.github.io/looup-game-canvas/resources/sound/gameMusic.ogg',
  0.4,
  true,
)
//
const playerJumpSound = new Sound(
  'https://origenz.github.io/looup-game-canvas/resources/sound/jump.mp3',
  1,
  false,
  true,
)
//
const hitSound = new Sound(
  'https://origenz.github.io/looup-game-canvas/resources/sound/ded.wav',
  1,
  false,
  true,
)
//
const coinSound = new Sound(
  'https://origenz.github.io/looup-game-canvas/resources/sound/coin.wav',
  1,
  false,
  true,
)

/****  OBJECT's VARIABLES ****/

// Pads
let padsArray = []
const padSpriteWidth = 150
const padSpriteHeight = 50

//Player
const spriteAnimations = []
let playerAnimationStates = []
let player = null

const playerSpriteWidth = 165
const playerSpriteHeight = 165

//Enemies
let enemiesArray = []

const beeSpriteWidth = 273
const beeSpriteHeight = 282

const ghostSpriteWidth = 160
const ghostSpriteHeight = 237.5

//Hits
const hitSpriteWidth = 200
const hitSpriteHeight = 178

const hit = new Hit(
  hitImage,
  hitSound,
  0,
  0,
  hitSpriteWidth,
  hitSpriteHeight,
  65,
)

//Coins
let coinsArray = []

const coinSpritewidth = 291
const coinSpriteHeight = 278

/****** FUNCTIONS  ******/

function createPads(isMultiplePads) {
  if (isMultiplePads) for (let i = 0; i < numberOfPads; i++) newPad(i)
  else newPad(1)
}

function newPad(padNum) {
  const gapBetweenPads = CANVAS_HEIGTH / numberOfPads
  const middleGround = CANVAS_WIDTH / 2

  let x
  let y
  let xPos
  xPos = Math.ceil(Math.random() * 2)
  xPos === 1
    ? (x = Math.random() * middleGround)
    : (x = Math.random() * middleGround + middleGround - padSpriteWidth)
  y = padNum * gapBetweenPads

  const pad = new Pad(
    padImg1,
    x,
    y,
    padSpriteWidth,
    padSpriteHeight,
    padSpeedModifier,
  )
  padsArray.unshift(pad)
  createCoin(pad)
}

function createCoin(pad) {
  const coinProbability = Math.round(Math.random() * 4)

  if (coinProbability === 4) {
    const coin = new Coin(
      coinImage,
      coinSound,
      pad.x,
      pad.y,
      coinSpeedModifier,
      coinSpritewidth,
      coinSpriteHeight,
    )
    const delay = Math.round(Math.random() * 3 + 1)

    if (delay === 2) coin.frame = 8
    else if (delay === 3) coin.frame = 7
    else if (delay === 4) coin.frame = 6
    coinsArray.push(coin)
  }
}

function createPlayer() {
  if (padsArray.length !== 0 && padsArray !== null) {
    const x = padsArray[0].x + playerSpriteWidth / 3.5
    const y = padsArray[0].y - playerSpriteHeight / 3
    player = new Player(
      playerImage,
      playerJumpSound,
      x,
      y,
      playerSpriteWidth,
      playerSpriteHeight,
    )
  }
}

function createPlayerSpriteAnimations() {
  playerAnimationStates = [
    {
      name: 'jumpLeft',
      frames: 6,
    },
    {
      name: 'jumpRight',
      frames: 6,
    },
    {
      name: 'fallLeft',
      frames: 6,
    },
    {
      name: 'fallRight',
      frames: 6,
    },
    {
      name: 'moveLeft',
      frames: 6,
    },
    {
      name: 'moveRight',
      frames: 6,
    },
  ]

  playerAnimationStates.forEach((state, i) => {
    let frames = {
      loc: [],
    }
    for (let j = 0; j < state.frames; j++) {
      let positionX = j * playerSpriteWidth
      let positionY = i * playerSpriteHeight
      frames.loc.push({ x: positionX, y: positionY })
    }
    spriteAnimations[state.name] = frames
  })
}

function createEnemies() {
  const millisToNewBee = 4800
  const millisToNewGhost = 12000

  enemiesOneIntervalId = setInterval(() => {
    if (document.hasFocus())
      enemiesArray.push(new Bee(beeImage, beeSpriteWidth, beeSpriteHeight))
  }, millisToNewBee)

  enemiesTwoIntervalId = setInterval(() => {
    if (document.hasFocus())
      enemiesArray.push(
        new Ghost(ghostImage, ghostSpriteWidth, ghostSpriteHeight),
      )
  }, millisToNewGhost)
}

function checkInPlatform(padsArray, playerObj) {
  for (const pad of padsArray) {
    if (
      playerObj.isColliding(pad) &&
      playerObj.y + playerObj.height - 1 <= pad.y + playerObj.vy
    ) {
      gameSpeed = 0
      playerObj.stop()
      playerObj.y = pad.y - playerObj.height
    }
  }
}

function checkEnemyCollisions(enemiesArray, playerObj) {
  enemiesArray.forEach((enemy) => {
    if (enemy.isColliding(playerObj)) {
      if (!hit.isTriggered) {
        hit.x = player.x - 5
        hit.y = player.y + 5
        hit.isTriggered = true
      }
      isGameover = true
    }
  })
}

function checkPickedCoin(coinsArray, playerObj) {
  coinsArray.forEach((coin) => {
    if (coin.isColliding(playerObj)) {
      coin.markedToDelete = true
      score += 100
    }
  })
}

function startGame() {
  document.querySelector('#game-area').focus()
  document.querySelector('.brand').style.display = 0
  document.querySelector('.brand').style.opacity = 0
  document.querySelector('.play').style.display = 'none'

  document.querySelectorAll('footer a').forEach((a) => {
    a.style.display = 'none'
  })

  toogleSoundButton()
  createPads(true)
  createPlayerSpriteAnimations()
  createPlayer()
  createEnemies()
  animate()
  gameTheme.play()
}

function gameOver() {
  clearInterval(enemiesOneIntervalId)
  clearInterval(enemiesTwoIntervalId)
  padsArray = []
  drawGameOverScreen()
  restartGameButton()
}

function restartGameButton() {
  document.querySelector('.replay').style.opacity = 1
  document.querySelector('.replay').style.backgroundColor = 'white'
}

function keyDown(event) {
  if (event.key === ' ') {
    isSpace = true
  } else if (event.key === 'ArrowLeft') {
    isLeft = true
    player.moveLeft()
  } else if (event.key === 'ArrowRight') {
    isRight = true
    player.moveRight()
  }
}

function keyUp(event) {
  if (event.key === ' ') isSpace = false
  if (event.key === 'ArrowLeft') isLeft = false
  if (event.key === 'ArrowRight') isRight = false
}

function loadModals() {
  modals.forEach((trigger) => {
    trigger.addEventListener('click', (event) => {
      event.preventDefault()
      const modal = document.getElementById(trigger.dataset.modal)
      modal.classList.add('open')
      const exits = modal.querySelectorAll('.modal-exit')
      exits.forEach((exit) => {
        exit.addEventListener('click', (event) => {
          event.preventDefault()
          modal.classList.remove('open')
        })
      })
    })
  })
}

function updateScore() {
  scoreCtx.font = '35px Questrian'
  scoreCtx.fillStyle = '#4ea640'
  scoreCtx.strokeStyle = '#FFFFFF'
  scoreCtx.fillText(`Score • ${score}`, 20, 55)

  scoreCtx.lineWidth = 2
  scoreCtx.strokeText(`Score • ${score}`, 20, 55)
}

function toogleSoundButton() {
  const offBtn = document.querySelector('#off')
  const onBtn = document.querySelector('#on')

  if (offBtn.style.display === 'none') {
    onBtn.style.display = 'none'
    offBtn.style.display = 'block'
  } else {
    onBtn.style.display = 'block'
    offBtn.style.display = 'none'
  }
}

function drawGameOverScreen() {
  canvas.style.zIndex = '1'

  ctx.fillStyle = '#52b3da'
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH + 50)

  ctx.textAlign = 'center'
  ctx.font = '120px Questrian'
  ctx.lineWidth = 4
  ctx.fillStyle = '#FFFFFF'
  ctx.strokeStyle = '#88ddf0'

  ctx.fillText(`GAME OVER`, CANVAS_WIDTH / 2, 350)
  ctx.strokeText(`GAME OVER`, CANVAS_WIDTH / 2, 350)

  ctx.font = '78px Questrian'
  ctx.fillText(`Your final score is`, CANVAS_WIDTH / 2, 450)
  ctx.strokeText(`Your final score is`, CANVAS_WIDTH / 2, 450)

  ctx.font = '120px Questrian'

  ctx.fillText(`${score}`, CANVAS_WIDTH / 2, 600)
  ctx.strokeText(`${score}`, CANVAS_WIDTH / 2, 600)
}

function animate() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH)
  scoreCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGTH)

  if (player.y + player.height > CANVAS_HEIGTH || isGameover) gameOver()

  if (gameSpeed > 0.3) {
    upFrames++
    score += Math.ceil((upFrames % 2) / 2)
  }

  checkEnemyCollisions(enemiesArray, player)
  checkInPlatform(padsArray, player)
  checkPickedCoin(coinsArray, player)

  if (padDeleted) {
    createPads(false)
    padDeleted = false
  }

  ;[
    ...layersArray,
    ...padsArray,
    ...enemiesArray,
    ...coinsArray,
    hit,
    player,
  ].forEach((object) => {
    object.draw()
    object.update()
  })

  padsArray = padsArray.filter((pad) => {
    return !pad.markedToDelete
  })
  enemiesArray = enemiesArray.filter((enemy) => {
    return !enemy.markedToDelete
  })
  coinsArray = coinsArray.filter((coin) => {
    return !coin.markedToDelete
  })

  if (!isGameover) updateScore()

  gameFrame++

  requestAnimationFrame(animate)
}

document.addEventListener('DOMContentLoaded', () => {
  loadModals()

  document.addEventListener('keydown', keyDown)
  document.addEventListener('keyup', keyUp)
  document.querySelector('.play').addEventListener('click', startGame)
  document.querySelector('#on').style.display = 'none'

  document
    .querySelector('#off')
    .addEventListener('click', () => gameTheme.play())

  document
    .querySelector('#on')
    .addEventListener('click', () => gameTheme.pause())

  document
    .querySelector('.replay')
    .addEventListener('click', () => window.location.reload())

  document
    .querySelectorAll('.music')
    .forEach((ele) => ele.addEventListener('click', toogleSoundButton))
})
