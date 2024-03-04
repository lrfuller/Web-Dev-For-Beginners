function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

function createSnakeFood(ctx, playersPosition, snack) {
  let tempX = randomNumberX(playersPosition);
  let tempY = randomNumberY(playersPosition);
  let xCoordinate = tempX * 20;
  let yCoordinate = tempY * 20;
  playersPosition.push({ x: tempX, y: tempX });
  console.log("players position");
  console.log(playersPosition);
  //26 x 26 grid. each square is 20 pixels in height and width
  //every 20 pixels is another tile
  ctx.drawImage(snack, xCoordinate, yCoordinate, 20, 20);
}

function randomNumberX(playersPosition) {
  let newNum = Math.floor(Math.random() * 26);

  // NEED TO TEST THIS
  // verify this by filling out the rest of the table with cookies, and verify the only ones left are valid
  for (let i = 0; i < playersPosition.length; i++) {
    console.log(playersPosition[i].x);
    if (playersPosition[i].x == newNum) {
      newNum = Math.floor(Math.random() * 26);
      i--;
    }
  }
  return newNum;
}

function randomNumberY(playersPosition) {
  let newNum = Math.floor(Math.random() * 26);

  // NEED TO TEST THIS
  // verify this by filling out the rest of the table with cookies, and verify the only ones left are valid
  for (let i = 0; i < playersPosition.length; i++) {
    if (playersPosition[i].y == newNum) {
      newNum = Math.floor(Math.random() * 26);
      i--;
    }
  }
  return newNum;
}

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
  ctx.imageSmoothingEnabled = false;

  //load and draw player
  //220, 220, 20, 20 would be the ideal number. But to center it, I use 222, 222, 16
  // (x * 20) - 20
  //TODO uncomment the below 3 lines after testing
  roundedRect(ctx, 2, 2, 16, 16, 1);
  roundedRect(ctx, 2, 22, 16, 16, 1);
  roundedRect(ctx, 2, 42, 16, 16, 1);

  let playersPosition = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 0, y: 2 },
  ];

  //TODO create function that will get the player's current position, and spawn in the snake food not in this position
  // playersPosition.push({ x: 2, y: 7 });

  const snack = await loadTexture(
    "/6-space-game/2-drawing-to-canvas/your-work/assets/cookie-solid.svg"
  );

  // for (let zzz = 0; playersPosition.length != 673; zzz++) {
  createSnakeFood(ctx, playersPosition, snack); //this needs to run after the player is created and moved. The snake food MUST NOT overlap with the player
  // }

  console.log(playersPosition);
};
