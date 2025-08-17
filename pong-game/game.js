const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 15, paddleHeight = 80;
const ballSize = 16;

// Left paddle (player)
const leftPaddle = {
    x: 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#4FC3F7'
};

// Right paddle (AI)
const rightPaddle = {
    x: canvas.width - paddleWidth - 20,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#FF7043',
    speed: 4
};

const ball = {
    x: canvas.width / 2 - ballSize / 2,
    y: canvas.height / 2 - ballSize / 2,
    size: ballSize,
    speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
    speedY: 3 * (Math.random() > 0.5 ? 1 : -1),
    color: '#FFF176'
};

function drawRect(obj) {
    ctx.fillStyle = obj.color;
    ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function drawBall(ball) {
    ctx.fillStyle = ball.color;
    ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function resetBall() {
    ball.x = canvas.width / 2 - ballSize / 2;
    ball.y = canvas.height / 2 - ballSize / 2;
    ball.speedX = 5 * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = 3 * (Math.random() > 0.5 ? 1 : -1);
}

function updateAI() {
    // Simple AI: move towards the ball's y position
    let target = ball.y + ball.size / 2;
    let paddleCenter = rightPaddle.y + rightPaddle.height / 2;
    if (target < paddleCenter - 10) {
        rightPaddle.y -= rightPaddle.speed;
    } else if (target > paddleCenter + 10) {
        rightPaddle.y += rightPaddle.speed;
    }
    // Prevent paddle from going out of bounds
    rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y));
}

function detectCollision(paddle) {
    return (
        ball.x < paddle.x + paddle.width &&
        ball.x + ball.size > paddle.x &&
        ball.y < paddle.y + paddle.height &&
        ball.y + ball.size > paddle.y
    );
}

function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top/bottom wall collision
    if (ball.y <= 0 || ball.y + ball.size >= canvas.height) {
        ball.speedY *= -1;
    }

    // Left paddle collision
    if (detectCollision(leftPaddle)) {
        ball.speedX *= -1;
        // Add a little randomness to ball's Y speed
        ball.speedY += (Math.random() - 0.5) * 2;
        ball.x = leftPaddle.x + leftPaddle.width; // Prevent sticking
    }

    // Right paddle collision
    if (detectCollision(rightPaddle)) {
        ball.speedX *= -1;
        ball.speedY += (Math.random() - 0.5) * 2;
        ball.x = rightPaddle.x - ball.size; // Prevent sticking
    }

    // Left/right wall: reset ball
    if (ball.x <= 0 || ball.x + ball.size >= canvas.width) {
        resetBall();
    }
}

function draw() {
    clear();
    drawRect(leftPaddle);
    drawRect(rightPaddle);
    drawBall(ball);
}

function gameLoop() {
    updateAI();
    updateBall();
    draw();
    requestAnimationFrame(gameLoop);
}

// Mouse control for left paddle
canvas.addEventListener('mousemove', function (e) {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - paddleHeight / 2;
    // Clamp paddle within bounds
    leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y));
});

// Start game
gameLoop();