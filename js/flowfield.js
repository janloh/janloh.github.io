/* Based on the work of: Johan Karlsson and https://codepen.io/Tibixx */

const MAXSPEED = 1.5;
let width = 0;
let height = 0;

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  vAdd(otherVector) {
    this.x += otherVector.x;
    this.y += otherVector.y;
  }
  getMagnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  setMagnitude(magnitude) {
    const angle = this.getAngle();
    this.x = Math.cos(angle) * magnitude;
    this.y = Math.sin(angle) * magnitude;
  }
  divide(wholeNumber) {
    return new Vector2(this.x / wholeNumber, this.y / wholeNumber);
  }
  getAngle() {
    return Math.atan2(this.y, this.x);
  }
  setAngle(angle) {
    const magnitude = this.getMagnitude();
    this.x = Math.cos(angle) * magnitude;
    this.y = Math.sin(angle) * magnitude;
  }
}

class Particle {
  constructor(x, y) {
    this.position = new Vector2(x, y);
    this.velocity = new Vector2(Math.random() - 0.5, Math.random() - 0.5);
    this.acceleration = new Vector2(0, 0);
    this.hue = Math.random()*30-15;
  }

  move(acceleration) {
    if (acceleration) this.acceleration.vAdd(acceleration);
    this.velocity.vAdd(this.acceleration);
    this.position.vAdd(this.velocity);
    if (this.velocity.getMagnitude() > MAXSPEED) this.velocity.setMagnitude(MAXSPEED);
    this.acceleration.setMagnitude(0);
  }

  wrap() {
    if (this.position.x > width) {
      this.position.x = 0;
    } else if (this.position.x < -this.fieldSize) {
      this.position.x = width - 1;
    }
    if (this.position.y > height) {
      this.position.y = 0;
    } else if (this.position.y < -this.fieldSize) {
      this.position.y = height - 1;
    }
  }
}

document.addEventListener("DOMContentLoaded", (event) => {
  
  let field = [];
  let columns = 0;
  let rows = 0;
  let particles = [];
  let noiseZ = 0;
  const particleCount = 3000;
  const particleSize = 0.85;
  const fieldSize = 70;
  const fieldForce = 0.15;
  const noiseSpeed = 0.003;
  const trailLength = 0.15;
  const hueBase = 210;
  const hueRange = 10;
  const canvas = document.getElementById('flowfield');
  const ctx = canvas.getContext('2d');

  function initParticles() {
    particles = [];
    let numberOfParticles = particleCount;
    for (let i = 0; i < numberOfParticles; i++) {
      let particle = new Particle(Math.random() * width, Math.random() * height);
      particles.push(particle);
    }
  }
  
  function initField() {
    field = new Array(columns);
    for (let x = 0; x < columns; x++) {
      field[x] = new Array(rows);
      for (let y = 0; y < rows; y++) {
        let v = new Vector2(0, 0);
        field[x][y] = v;
      }
    }
  }
  
  function calcField() {
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        let angle = noise.simplex3(x / 20, y / 20, noiseZ) * Math.PI * 2;
        let length = noise.simplex3(x / 40 + 40000, y / 40 + 40000, noiseZ) * fieldForce;
        field[x][y].setMagnitude(length);
        field[x][y].setAngle(angle);
      }
    }
  }
  
  function reset() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    noise.seed(Math.random());
    columns = Math.round(width / fieldSize) + 1;
    rows = Math.round(height / fieldSize) + 1;
    initParticles();
    initField();
  }
  
  function draw() {
    requestAnimationFrame(draw);
    calcField();
    noiseZ += noiseSpeed;
    drawBackground();
    drawParticles();
  }
  
  function drawBackground() {
    ctx.fillStyle = "rgba(1,14,20,"+trailLength+")";
    ctx.fillRect(0, 0, width, height);
  }
  
  function drawParticles() {
    particles.forEach(particle => {
      var ps = particle.fieldSize = Math.abs(particle.velocity.x + particle.velocity.y)*particleSize + 0.3;
      ctx.fillStyle = "hsl("+(hueBase + particle.hue + ((particle.velocity.x + particle.velocity.y)*hueRange))+", 100%, 50%)";
      ctx.fillRect(particle.position.x, particle.position.y, ps, ps);
      let position = particle.position.divide(fieldSize);
      let displacement;
      if (position.x >= 0 && position.x < columns && position.y >= 0 && position.y < rows) {
        displacement = field[Math.floor(position.x)][Math.floor(position.y)];
      }
      particle.move(displacement);
      particle.wrap();
    });
  }

  reset();
  window.addEventListener('resize', reset);
  draw();
});
