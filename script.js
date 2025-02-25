const section1=  document.querySelector(".section1");
const section2=  document.querySelector(".section2");
section2.classList.add("hide")
const gameContainer = document.getElementById('gameContainer');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('startButton');
const nameInput = document.getElementById('nameInput');
const gameOverDisplay = document.getElementById('gameOver');

let snake = [{ x: 10, y: 10 }];
let food = { x: 0, y: 0 };
let score = 0;
let direction = 'RIGHT';
let gameInterval;
let isGameOver = false;

function startGame() {
  if (!nameInput.value) {
    alert("Please enter your name!");
    return;
  }
  section2.classList.remove("hide")
  section1.classList.add("hide")
  snake = [{ x: 10, y: 10 }];
  score = 0;
  direction = 'RIGHT';
  isGameOver = false;
  scoreDisplay.textContent = `Score: ${score}`;
  gameOverDisplay.style.display = 'none';
  generateFood();
  gameInterval = setInterval(gameLoop, 100);
}

function gameLoop() {
  if (isGameOver) return;
  moveSnake();
  checkCollision();
  checkFood();
  render();
}

function moveSnake() {
  let head = { ...snake[0] };

  if (direction === 'UP') head.y -= 10;
  if (direction === 'DOWN') head.y += 10;
  if (direction === 'LEFT') head.x -= 10;
  if (direction === 'RIGHT') head.x += 10;

  snake.unshift(head);
  snake.pop();
}

function checkCollision() {
  const head = snake[0];

  if (head.x < 0 || head.x >= 500 || head.y < 0 || head.y >= 500) {
    gameOver();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver();
    }
  }
}

function checkFood() {
  const head = snake[0];
  if (head.x === food.x && head.y === food.y) {
    score += 10;
    scoreDisplay.textContent = `Score: ${score}`;
    snake.push({}); // Add a new segment to the snake
    generateFood();
  }
}

function generateFood() {
  food.x = Math.floor(Math.random() * 50) * 10;
  food.y = Math.floor(Math.random() * 50) * 10;
}

function render() {
  gameContainer.innerHTML = '';

  // Draw snake
  snake.forEach(segment => {
    const snakeSegment = document.createElement('div');
    snakeSegment.style.width = '10px';
    snakeSegment.style.height = '10px';
    snakeSegment.style.position = 'absolute';
    snakeSegment.style.backgroundColor = 'red';
    snakeSegment.style.left = `${segment.x}px`;
    snakeSegment.style.top = `${segment.y}px`;
    gameContainer.appendChild(snakeSegment);
  });

  // Draw food
  const foodElement = document.createElement('div');
  foodElement.style.width = '10px';
  foodElement.style.height = '10px';
  foodElement.style.position = 'absolute';
  foodElement.style.backgroundColor = 'green';
  foodElement.style.left = `${food.x}px`;
  foodElement.style.top = `${food.y}px`;
  gameContainer.appendChild(foodElement);
}

function gameOver() {
  clearInterval(gameInterval);
  isGameOver = true;
  gameOverDisplay.style.display = 'block';
  gameOverDisplay.textContent = `Game Over, ${nameInput.value}! Final Score: ${score}`;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
});

startButton.addEventListener('click', startGame);