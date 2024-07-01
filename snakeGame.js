// Classical Snake Game with Obstacles

// Game settings
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameWidth = canvas.width;
const gameHeight = canvas.height;
const snakeSize = 20;
let snake = [{x: 160, y: 160}, {x: 140, y: 160}, {x: 120, y: 160}];
let dx = snakeSize;
let dy = 0;
let foodX;
let foodY;
let score = 0;
let obstacles = [];

// Update the score
function updateScore() {
  document.getElementById('score').innerText = 'Score: ' + score;
}

// Place food on the game board
function placeFood() {
  foodX = Math.floor(Math.random() * (gameWidth/snakeSize)) * snakeSize;
  foodY = Math.floor(Math.random() * (gameHeight/snakeSize)) * snakeSize;
}

// Place a single obstacle
function placeObstacle() {
  const obstaclePosition = {
    x: Math.floor(Math.random() * (gameWidth / snakeSize)) * snakeSize,
    y: Math.floor(Math.random() * (gameHeight / snakeSize)) * snakeSize,
    width: snakeSize,
    height: snakeSize * 2
  };
  obstacles.push(obstaclePosition);
}

// Initialize obstacles
function initObstacles(numberOfObstacles) {
  obstacles = [];
  for (let i = 0; i < numberOfObstacles; i++) {
    placeObstacle();
  }
}

// Draw the snake on the canvas
function drawSnake() {
  snake.forEach(part => {
    ctx.fillStyle = 'green';
    ctx.fillRect(part.x, part.y, snakeSize, snakeSize);
    ctx.strokeRect(part.x, part.y, snakeSize, snakeSize);
  });
}

// Move the snake and allow it to go through walls
function moveSnake() {
  // Calculate new head position
  let head = {x: snake[0].x + dx, y: snake[0].y + dy};

  // Wrap snake position horizontally on canvas
  if (head.x >= gameWidth) {
    head.x = 0;
  } else if (head.x < 0) {
    head.x = gameWidth - snakeSize;
  }

  // Wrap snake position vertically on canvas
  if (head.y >= gameHeight) {
    head.y = 0;
  } else if (head.y < 0) {
    head.y = gameHeight - snakeSize;
  }

  // Add new head to the beginning of snake body
  snake.unshift(head);

  // Check for food consumption
  if (head.x === foodX && head.y === foodY) {
    score += 10;
    placeFood();
    updateScore(); // Update the score display
  }else {
    snake.pop(); // Remove the last part of snake if no food is eaten
  }
}

// Check collision with walls, itself, or obstacles
function checkCollision() {
  const head = snake[0];
  for (let i = 4; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) return true;
  }
  for (const obstacle of obstacles) {
    if (head.x < obstacle.x + obstacle.width && head.x + snakeSize > obstacle.x &&
        head.y < obstacle.y + obstacle.height && head.y + snakeSize > obstacle.y) {
      return true; // Collision with an obstacle
    }
  }
  return head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameHeight;
}

// Draw food on the canvas
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(foodX, foodY, snakeSize, snakeSize);
}

// Draw obstacles on the canvas
function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = 'grey';
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
  });
}

// Update the game
function updateGame() {
  if (checkCollision()) {
    alert('Game Over. Score: ' + score);
    document.location.reload();
    return;
  }
  setTimeout(() => {
    ctx.clearRect(0, 0, gameWidth, gameHeight);
    drawFood();
    drawObstacles();
    moveSnake();
    drawSnake();
    updateGame();
  }, 100);
}

// Change snake direction
function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  
  const keyPressed = event.keyCode;
  const goingUp = dy === -snakeSize;
  const goingDown = dy === snakeSize;
  const goingRight = dx === snakeSize;
  const goingLeft = dx === -snakeSize;
  
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -snakeSize;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -snakeSize;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = snakeSize;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = snakeSize;
  }
}

// Start the game
function startGame() {
  score = 0; // Reset score
  updateScore(); // Initialize score display
  placeFood();
  initObstacles(5); // Initialize 5 obstacles
  document.addEventListener('keydown', changeDirection);
  updateGame();
}

startGame();