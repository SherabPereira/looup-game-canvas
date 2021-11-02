class Sound {
  constructor(src, volume, isLoop, isSFX) {
    this.sound = document.createElement('audio')
    this.sound.src = src
    this.sound.preload = 'auto'
    this.sound.controls = 'none'
    this.sound.style.display = 'none'
    this.sound.volume = volume
    this.sound.loop = isLoop
    this.isSFX = isSFX
    document.body.appendChild(this.sound)
  }

  play() {
    this.sound.play()
    if (this.isSFX) this.sound.currentTime = 0
  }

  pause() {
    this.sound.pause()
  }

  stop() {
    this.sound.pause()
    this.sound.currentTime = 0
  }
}
