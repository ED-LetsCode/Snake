"use strict";

let gameField = document.getElementById("canvas");
let ctx = gameField.getContext("2d");
let rows = 20;
let cols = 20;
let cellWidth = gameField.width / cols;
let cellHeight = gameField.height / rows;
let direction = "DOWN";
let foodCollected = false;
let snake = [{ x: 2, y: 3 }];
let food = { x: 5, y: 5 };
let gameSpeed = 250;
let collectedFoods = 0;
let interveralId;

showHighScore();
startGame();

function startGame() {
  placeFood();
  interveralId = setInterval(gameLoop, gameSpeed);
  document.addEventListener("keydown", keyDown);
  draw();
}

// Places food for the snake on a random postion in game field
function placeFood() {
  while (true) {
    let newFood = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };

    if (!snake.find((part) => part.x == newFood.x && part.y == newFood.y)) {
      food = newFood;
      break;
    }
  }
}

// Draws the gamefield, snake and the food
function draw() {
  //Gamefield
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, gameField.width, gameField.height);

  //Snakebody
  ctx.fillStyle = "black";
  snake.forEach((part) => addPixel(part.x, part.y));

  //Food
  ctx.fillStyle = "green";
  addPixel(food.x, food.y);

  requestAnimationFrame(draw);
}

// Adds a pixel to the gamefield
function addPixel(x, y) {
  ctx.fillRect(x * cellWidth, y * cellHeight, cellWidth - 1, cellHeight - 1);
}

// Moves the snake
function moveSnake() {
  for (let i = snake.length - 1; i > 0; i--) {
    let part = snake[i];
    let nextPart = snake[i - 1];
    part.x = nextPart.x;
    part.y = nextPart.y;
  }
}

// Changes the direction of the snake
function gameLoop() {
  checkIfGameIsOver();
  if (foodCollected) {
    // If the food is collected speed up the gameSpeed
    if (gameSpeed !== 10) {
      clearInterval(interveralId);
      interveralId = setInterval(gameLoop, (gameSpeed -= 5));
    }
    snake = [{ x: snake[0].x, y: snake[0].y }, ...snake];
    foodCollected = false;
    collectedFoods++;
  }

  moveSnake();

  switch (direction) {
    case "LEFT":
      snake[0].x--;
      break;
    case "UP":
      snake[0].y--;
      break;
    case "RIGHT":
      snake[0].x++;
      break;
    case "DOWN":
      snake[0].y++;
      break;
  }

  if (snake[0].x == food.x && snake[0].y == food.y) {
    foodCollected = true;
    placeFood();
  }
}

// Catches the keystrokes and sets the direction variable
function keyDown(event) {
  switch (event.keyCode) {
    case 37:
      direction = "LEFT";
      break;
    case 38:
      direction = "UP";
      break;
    case 39:
      direction = "RIGHT";
      break;
    case 40:
      direction = "DOWN";
      break;
  }
}

// Checks if game is over and resets the snake
function checkIfGameIsOver() {
  let firstPart = snake[0];
  let otherParts = snake.slice(1);
  let crashedPart = otherParts.find(
    (part) => part.x == firstPart.x && part.y == firstPart.y
  );

  if (
    snake[0].x < 0 ||
    snake[0].x > cols - 1 ||
    snake[0].y < 0 ||
    snake[0].y > rows - 1 ||
    crashedPart
  )
    resetGame();
}

function resetGame() {
  let gameOverOverview = document.getElementById("gameOver");
  let playAgainBtn = document.getElementById("playBtn");
  let scoreText = document.getElementById("score");
  scoreText.textContent = `You're score is ${collectedFoods}`;
  gameOverOverview.style = "visibility:visible;";
  setHighScore();
  showHighScore();

  playAgainBtn.addEventListener("click", () => {
    placeFood();
    snake = [{ x: 2, y: 3 }];
    direction = "DOWN";
    gameSpeed = 250;
    collectedFoods = 0;
    clearInterval(interveralId);
    interveralId = setInterval(gameLoop, gameSpeed);

    gameOverOverview.style = "visibility:hidden;";
  });
}

// Loads highscore from localstorage
function loadHighScore() {
  return localStorage.getItem("highScore") ?? 0;
}

// Sets highscore in the localstorage
function setHighScore() {
  if (collectedFoods > localStorage.getItem("highScore") ?? 0)
    localStorage.setItem("highScore", collectedFoods);
}

// Sets the paragraph content (Highscore)
function showHighScore() {
  document.getElementById(
    "highScore"
  ).textContent = `High score: ${loadHighScore()}`;
}
