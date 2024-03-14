let x = 100;
let y = 100;
let trailX = x;
let trailY = y;
let snackX = 0;
let snackY = 0;
let radius = 0;
let speed = 2;
let playerSize = 20;

let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let raf;

function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

function createSnakeFood(ctx, snack) {
  //TODO finish this
  //   if (
  //     x >= snackX + 20 ||
  //     x <= snackX - 1 ||
  //     y >= snackY + 20 ||
  //     y <= snackY - 1
  //   ) {
  //     let tempX = randomNumber();
  //     let tempY = randomNumber();
  //     let xCoordinate = tempX * 20;
  //     let yCoordinate = tempY * 20;
  //     snackX = xCoordinate;
  //     snackY = yCoordinate;
  //     //26 x 26 grid. each square is 20 pixels in height and width
  //     //every 20 pixels is another tile
  //     ctx.drawImage(snack, xCoordinate, yCoordinate, 20, 20);
  //   } else {
  ctx.drawImage(snack, snackX, snackY, 20, 20);
  //   }
}

function randomNumber() {
  return Math.floor(Math.random() * 26);
}

//https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#drawing_rectangles
function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x, y + radius);
  ctx.arcTo(x, y + height, x + radius, y + height, radius);
  ctx.arcTo(x + width, y + height, x + width, y + height - radius, radius);
  ctx.arcTo(x + width, y, x + width - radius, y, radius);
  ctx.arcTo(x, y, x, y + radius, radius);
  ctx.fill();
}

window.onload = async () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  //   ctx.imageSmoothingEnabled = false;

  //   roundedRect(ctx, 2, 2, 16, 16, 1);
  //   roundedRect(ctx, 2, 22, 16, 16, 1);
  //   roundedRect(ctx, 2, 42, 16, 16, 1);

  const snack = await loadTexture(
    "/6-space-game/2-drawing-to-canvas/your-work/assets/cookie-solid.svg"
  );

  function drawGame() {
    window.requestAnimationFrame(drawGame);

    clearScreen();
    inputs();
    boundryCheck();
    drawPlayer();
    drawShadow();
    createSnakeFood(ctx, snack);
    // console.log("player x: " + x);
    // console.log("player y: " + y);
    // console.log("snack x: " + snackX);
    // console.log("snack y: " + snackY);
  }
  // createSnakeFood(ctx, snack);

  function boundryCheck() {
    //up
    if (y < radius) {
      y = radius;
    }
    //down
    if (y > canvas.height - radius - playerSize) {
      y = canvas.height - radius - playerSize;
    }
    //left
    if (x < radius) {
      x = radius;
    }
    //right
    if (x > canvas.width - radius - playerSize) {
      x = canvas.width - radius - playerSize;
    }
  }

  function inputs() {
    if (upPressed) {
      y = y - speed;
      // trailY = y - speed + 25;
    }
    if (downPressed) {
      y = y + speed;
      // trailY = y - speed - 25;
    }
    if (leftPressed) {
      x = x - speed;
      // trailX = x - speed + 25;
    }
    if (rightPressed) {
      x = x + speed;
      // trailX = x - speed - 25;
    }
  }

  function drawPlayer() {
    ctx.beginPath();
    // roundedRect(ctx, x, y, playerSize, playerSize, 1);
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, playerSize, playerSize);
    // ctx.arc(x, y, 60, 60, 3 * Math.PI);
    ctx.fill();
    ctx.closePath();
  }

  function drawShadow() {
    // ctx.beginPath();
    // // roundedRect(ctx, trailX, trailY, playerSize, playerSize, 1);
    // ctx.fillRect(trailX, trailY, playerSize, playerSize);
    // ctx.closePath();
    // ctx.fill();
  }

  function clearScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  document.body.addEventListener("keydown", keyDown);
  document.body.addEventListener("keyup", keyUp);

  function keyDown(event) {
    //up
    if (event.keyCode == 38) {
      upPressed = true;
    }

    //down
    if (event.keyCode == 40) {
      downPressed = true;
    }
    //left
    if (event.keyCode == 37) {
      leftPressed = true;
    }

    //right
    if (event.keyCode == 39) {
      rightPressed = true;
    }
  }

  function keyUp(event) {
    //up
    if (event.keyCode == 38) {
      upPressed = false;
    }

    //down
    if (event.keyCode == 40) {
      downPressed = false;
    }
    //left
    if (event.keyCode == 37) {
      leftPressed = false;
    }

    //right
    if (event.keyCode == 39) {
      rightPressed = false;
    }
  }

  drawGame();
};
