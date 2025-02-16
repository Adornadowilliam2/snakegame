const gameArea = document.getElementById("gameArea");
const foodDiv = document.getElementById("food");
const scoreDiv = document.getElementById("score");
const scale = 20;
let score = 0;
let playerName = "";
let snake;
let food;
let gameStarted = false;
let gameInterval;

function startGame() {
    playerName = document.getElementById("playerName").value;
    if (!playerName) {
        alert("Please enter your name!");
        return;
    }
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    gameStarted = true;
    setup();
}

function setup() {
    snake = new Snake();
    food = new Food();
    score = 0;
    scoreDiv.innerText = `Score: ${score}`;
    gameInterval = setInterval(gameLoop, 100);  // Start the game loop
    document.addEventListener("keydown", direction);
}

function gameLoop() {
    clearGameArea();  // Clear previous game frame

    snake.update();
    snake.draw();
    food.draw();

    if (snake.eat(food)) {
        score++;
        scoreDiv.innerText = `Score: ${score}`;
        food.randomize();
    }

    if (snake.collide()) {
        resetGame();
    }
}

function direction(event) {
    const code = event.keyCode;
    if (code === 37 && snake.dx === 0) {
        snake.changeDirection(-scale, 0);
    } else if (code === 38 && snake.dy === 0) {
        snake.changeDirection(0, -scale);
    } else if (code === 39 && snake.dx === 0) {
        snake.changeDirection(scale, 0);
    } else if (code === 40 && snake.dy === 0) {
        snake.changeDirection(0, scale);
    }
}

function resetGame() {
    // Reset score and game elements
    score = 0;
    scoreDiv.innerText = `Score: ${score}`;
    clearGameArea();  // Clear all game elements (snake and food)
    snake = new Snake();  // Reinitialize snake
    food.randomize();  // Place new food
}

function clearGameArea() {
    // Clears previous snake divs before drawing a new frame
    const snakeParts = document.querySelectorAll(".snake-part");
    snakeParts.forEach(part => part.remove());
}

function Snake() {
    this.snakeArray = [{ x: 10 * scale, y: 10 * scale }];
    this.dx = scale;
    this.dy = 0;

    this.update = function () {
        const head = { x: this.snakeArray[0].x + this.dx, y: this.snakeArray[0].y + this.dy };
        this.snakeArray.unshift(head);

        if (!this.eat(food)) {
            this.snakeArray.pop();
        }
    };

    this.draw = function () {
        for (let i = 0; i < this.snakeArray.length; i++) {
            const snakePart = document.createElement("div");
            snakePart.classList.add("snake-part");
            snakePart.style.width = `${scale}px`;
            snakePart.style.height = `${scale}px`;
            snakePart.style.backgroundColor = i === 0 ? "red" : "white";  // Head is red, body is white
            snakePart.style.position = "absolute";
            snakePart.style.left = `${this.snakeArray[i].x}px`;
            snakePart.style.top = `${this.snakeArray[i].y}px`;
            gameArea.appendChild(snakePart);
        }
    };

    this.changeDirection = function (dx, dy) {
        this.dx = dx;
        this.dy = dy;
    };

    this.eat = function (food) {
        if (this.snakeArray[0].x === food.x && this.snakeArray[0].y === food.y) {
            return true;
        }
        return false;
    };

    this.collide = function () {
        for (let i = 1; i < this.snakeArray.length; i++) {
            if (this.snakeArray[0].x === this.snakeArray[i].x && this.snakeArray[0].y === this.snakeArray[i].y) {
                return true;
            }
        }

        if (this.snakeArray[0].x < 0 || this.snakeArray[0].x >= gameArea.offsetWidth || this.snakeArray[0].y < 0 || this.snakeArray[0].y >= gameArea.offsetHeight) {
            return true;
        }

        return false;
    };
}

function Food() {
    this.x;
    this.y;

    this.randomize = function () {
        this.x = Math.floor(Math.random() * Math.floor(gameArea.offsetWidth / scale)) * scale;
        this.y = Math.floor(Math.random() * Math.floor(gameArea.offsetHeight / scale)) * scale;
        foodDiv.style.left = `${this.x}px`;
        foodDiv.style.top = `${this.y}px`;
    };

    this.draw = function () {
        foodDiv.style.left = `${this.x}px`;
        foodDiv.style.top = `${this.y}px`;
    };
}
