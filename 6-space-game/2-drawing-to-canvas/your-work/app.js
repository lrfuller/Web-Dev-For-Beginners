function loadTexture(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = path;
    img.onload = () => {
      resolve(img);
    };
  });
}

async function createSnakeFood(ctx) {
  //load and draw snack
  const snack = await loadTexture(
    "/6-space-game/2-drawing-to-canvas/your-work/assets/cookie-solid.svg"
  );
  let x = Math.floor(Math.random() * 26);
  let y = Math.floor(Math.random() * 26);
  //26 x 26 grid. each square is 20 pixels in height and width
  //every 20 pixels is another tile
  ctx.drawImage(snack, 20, 20, 20, 20);
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
  roundedRect(ctx, 222, 222, 16, 16, 1);
  roundedRect(ctx, 222, 202, 16, 16, 1);
  roundedRect(ctx, 222, 182, 16, 16, 1);
  // ctx.fillRect(222, 222, 16, 16);
  // ctx.fillRect(222, 202, 16, 16);
  // ctx.fillRect(222, 182, 16, 16);

  //TODO create function that will get the player's current position, and spawn in the snake food not in this
  //this needs to run after the player is created and moved. The snake food MUST NOT overlap with the player
  //this will need to be checked everytime the snake food is spawned.
  createSnakeFood(ctx);

  // TODO uncomment the next line when you add enemies to screen
  //createEnemies(ctx, canvas, enemyImg);
};
