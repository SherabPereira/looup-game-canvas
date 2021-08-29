class Sound {
  constructor(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.preload = "auto";
    this.sound.controls = "none";
    this.sound.style.display = "none";
    this.sound.loop = true;
    this.sound.muted = true;
    this.sound.volume = 0.4;
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.play();
    this.sound.muted = false;
  }

  pause() {
    this.sound.pause();
  }
  
  stop() {
    this.sound.pause();
    this.sound.currentTime = 0;
  }
}
