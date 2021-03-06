/* Based on the work of: Johan Karlsson and Tibix */

let canvas, ctx, field, width, height, fieldSize, columns, rows, noiseZ, particles, hue;
(noiseZ = 0);
particleCount = 2000;
particleSize = 0.9;
fieldSize = 70;
fieldForce = 0.15;
noiseSpeed = 0.003;
sORp = true;
trailLength = 0.15;
hueBase = 10;
hueRange = 5;
maxSpeed = 2.5;
enableGUI = true;

var ui = new function() {
  this.particleCount = particleCount;
  this.particleSize = particleSize;
  this.fieldSize = fieldSize;
  this.fieldForce = fieldForce;
  this.noiseSpeed = noiseSpeed;
  this.simplexOrPerlin = sORp;
  this.trailLength = trailLength;
  this.maxSpeed = maxSpeed;
  this.hueBase = hueBase;
  this.hueRange = hueRange;

  this.change = function() {
    particleSize = ui.particleSize;
    fieldSize = ui.fieldSize;
    fieldForce = ui.fieldForce;
    noiseSpeed = ui.noiseSpeed;
    maxSpeed = ui.maxSpeed;
    hueBase = ui.hueBase;
    hueRange = ui.hueRange;
    fieldColor = ui.fieldColor;
    ui.simplexOrPerlin?sORp=1:sORp=0;
  }
  
  this.reset = function() {
    particleCount = ui.particleCount;
    reset();
  }
  
  this.bgColor = function(){
    trailLength = ui.trailLength;
  }
}();

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
    if (this.velocity.getMagnitude() > maxSpeed) this.velocity.setMagnitude(maxSpeed);
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

canvas = document.querySelector("#canvas");
ctx = canvas.getContext("2d");
reset();
window.addEventListener("resize", reset);

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
  //ctx.strokeStyle = fieldColor;
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
  ctx.fillStyle = "rgba(0,0,0,"+ui.trailLength+")";
  ctx.fillRect(0, 0, width, height);
}

function drawParticles() {
  particles.forEach(particle => {
    var ps = particle.fieldSize = Math.abs(particle.velocity.x + particle.velocity.y)*particleSize + 0.3;
    ctx.fillStyle = "hsl("+(hueBase + particle.hue + ((particle.velocity.x + particle.velocity.y)*hueRange))+", 100%, 50%)";
    ctx.fillRect(p.position.x, p.position.y, ps, ps);
    let position = p.position.divide(fieldSize);
    let displacement;
    if (position.x >= 0 && position.x < columns && position.y >= 0 && position.y < rows) {
      displacement = field[Math.floor(position.x)][Math.floor(position.y)];
    }
    particle.move(displacement);
    particle.wrap();
  });
}

draw();
