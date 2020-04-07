const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scoreInfo = document.querySelector('#score-info');

// get DPI
let dpi = window.devicePixelRatio;

// Fix blurry drawings in canvas
function fixDpi() {
    let styleHeight = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
    let styleWidth = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);

    canvas.setAttribute('height', styleHeight * dpi);
    canvas.setAttribute('width', styleWidth * dpi);
}

fixDpi();

const centerY = canvas.height / 2;
const centerX = canvas.width / 2;

let dx, dy, speed, foodX, foodY, gs, score, backgroundColor;

dx = 0; // Number to add to player X
dy = 0; // Number to add to player Y

backgroundColor = '#ffeecc'; // Background color
snakeColor = '#3efc44'; // Snake color
size = 30; // Player size and food size
speed = 5; // Player speed
gs = false; // Game started
score = 0; // Player's score
startTime = 400;

setInterval(() => {backgroundColor = '#cc3360';}, startTime);
setInterval(() => {backgroundColor = '#334cce'}, startTime * 2);
setInterval(() => {backgroundColor = '#9efeee'}, startTime * 3);
setInterval(() => {backgroundColor = '#9ecbee'}, startTime * 4);
setInterval(() => {backgroundColor = '#3ccfef'}, startTime * 5);
setInterval(() => {backgroundColor = '#8ffeff'}, startTime * 6);

// The coordinates of the snake
let snake = [
    {x: centerX, y: centerY },
    {x: centerX - size, y: centerY},
    {x: centerX - size * 2, y: centerY},
    {x: centerX - size * 3, y: centerY},
    {x: centerX - size * 4, y: centerY},
]

// Draw parts of the snake
function drawSnakePart(snakePart) {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(snakePart.x, snakePart.y, size, size);
}

// Draw the snake
function drawSnake() {
    snake.forEach(drawSnakePart);
}

function moveSnake() {
    const head =  {x: snake[0].x + dx, y: snake[0].y + dy};

    snake.unshift(head);

    // If snake eats the food
    if (snake[0].x < (foodX + size) &&
        snake[0].x + size > foodX &&
        snake[0].y < (foodY + size) &&
        snake[0].y + size > foodY    
    ) {
        score += 10;
        speed += .2;
        createFood();
        scoreInfo.innerHTML = "<b>SCORE:</b> " + score;
    } else {
        setTimeout(() => {snake.pop();}, 500)
    }

    for (let i = 0; i < snake.length; i++) {
        if (snake[0].x < (snake[i] + size) ||
            snake[0].y === snake[i]) {
                snake.splice(i);
            }
    }
}

function clearCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function changeDirection(event) {
    if (event.key === 'ArrowRight' && dx <= 0 && dx >= 0) {
        dx = speed;
        dy = 0;
        gs = true;
    }

    if (event.key === 'ArrowLeft' && dx >= 0 && dx <= 0) {
        dx = -speed;
        dy = 0;
        gs = true;
    }

    if (event.key === 'ArrowDown' && dy <= 0 && dy >= 0) {
        dx = 0;
        dy = speed;
        gs = true;
    }
    
    if (event.key === 'ArrowUp' && dy >= 0 && dy <= 0) {
        dx = 0;
        dy = -speed;
        gs = true;
    }
    
}

// Generate random X and Y coordinate value for food
function randomCoord(min, max) {
    return Math.round((Math.random() * (max - min) + min) / size) * size;
}

function createFood() {
    foodX = randomCoord(0, canvas.width - size);
    foodY = randomCoord(0, canvas.height - size);
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(foodX, foodY, size, size);
}

// Detect walls and teleport to the other side if hit
function detectWalls() {
    if (snake[0].x < 0) {
        snake[0].x = canvas.width;
    } else if (snake[0].x > canvas.width) {
        snake[0].x = 0;
    } else if (snake[0].y < 0) {
        snake[0].y = canvas.height;
    } else if (snake[0].y > canvas.height) {
        snake[0].y = 0;
    }
}

// game loop
function loop() {
    clearCanvas();
    detectWalls();
    if (gs) {
        drawFood();
    }
    drawSnake();
    moveSnake();
    requestAnimationFrame(loop);
}

loop();
window.onload = () => {
    createFood();
}

document.addEventListener('keydown', changeDirection);