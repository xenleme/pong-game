const canvas = document.getElementById('pong');

const ctx = canvas.getContext('2d');

let hit = new Audio();
let wall = new Audio();
hit.src = 'sound/hit.wav';
wall.src = 'sound/wall.mp3';

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 10,
  velocityX: 5,
  velocityY: 5,
  speed: 7
};

const user = {
  x: 0,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0
};

const computer = {
  x: canvas.width - 10,
  y: (canvas.height - 100) / 2,
  width: 10,
  height: 100,
  score: 0
};

const net = {
  x: (canvas.width - 2) / 2,
  y: 0,
  height: 10,
  width: 4
};

function drawArc(x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fill();
}

function drawRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

canvas.addEventListener('mousemove', getMousePos);

function getMousePos(evt) {
  let rect = canvas.getBoundingClientRect();

  user.y = evt.clientY - rect.top - user.height / 2;
}

function resetBall() {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  ball.velocityX = -ball.velocityX;
  ball.speed = 7;
}

function drawNet() {
  for (let i = 0; i <= canvas.height; i += 15) {
    drawRect(net.x, net.y + i, net.width, net.height, net.color);
  }
}

function drawText(text, x, y) {
  ctx.fillStyle = '#f0e9df';
  ctx.font = '80px Orbitron';
  ctx.fillText(text, x, y);
}

function collision(b, p) {
  p.top = p.y;
  p.bottom = p.y + p.height;
  p.left = p.x;
  p.right = p.x + p.width;

  b.top = b.y - b.radius;
  b.bottom = b.y + b.radius;
  b.left = b.x - b.radius;
  b.right = b.x + b.radius;

  return (
    p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top
  );
}

function update() {
  if (ball.x - ball.radius < 0) {
    computer.score++;
    resetBall();
  } else if (ball.x + ball.radius > canvas.width) {
    user.score++;
    resetBall();
  }

  ball.x += ball.velocityX;
  ball.y += ball.velocityY;

  computer.y += (ball.y - (computer.y + computer.height / 2)) * 0.1;

  if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
    ball.velocityY = -ball.velocityY;
    wall.play();
  }

  let player = ball.x + ball.radius < canvas.width / 2 ? user : computer;

  if (collision(ball, player)) {
    hit.play();
    let collidePoint = ball.y - (player.y + player.height / 2);
    collidePoint = collidePoint / (player.height / 2);

    let angleRad = (Math.PI / 4) * collidePoint;

    let direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(angleRad);
    ball.velocityY = ball.speed * Math.sin(angleRad);

    ball.speed += 0.1;
  }
}

function render() {
  drawRect(0, 0, canvas.width, canvas.height, '#2e2c29');
  drawText(user.score, canvas.width / 6, canvas.height / 5);
  drawText(computer.score, (3 * canvas.width) / 4, canvas.height / 5);
  drawNet();
  drawRect(user.x, user.y, user.width, user.height, user.color);
  drawRect(
    computer.x,
    computer.y,
    computer.width,
    computer.height,
    computer.color
  );

  drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function game() {
  update();
  render();
}

let framePerSecond = 50;

let loop = setInterval(game, 1000 / framePerSecond);

const muteSound = document.getElementById('mute-sound');
const enableSound = document.getElementById('enable-sound');

function enableMute() {
  hit.muted = true;
  wall.muted = true;
}

function disableMute() {
  hit.muted = false;
  wall.muted = false;
}

muteSound.addEventListener('click', enableMute);
enableSound.addEventListener('click', disableMute);
