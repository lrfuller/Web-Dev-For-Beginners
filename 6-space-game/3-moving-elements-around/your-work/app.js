const ctx = canvas.getContext("2d");
const frameRate = 30; // must divide into 60 by whole number eg 60,30,20,15,10
var frameCount = 0;

// define keys to listen to
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  anykey: false,
};

// sets key to true if key is down
function keyboardEvent(event) {
  if (keys[event.code] !== undefined) {
    keys[event.code] = event.type === "keydown";
    event.preventDefault();
    event.type === "keydown" && (keys.anykey = true);
  }
}

// add key listeners to window
addEventListener("keydown", keyboardEvent);
addEventListener("keyup", keyboardEvent);

// For SO snippet as it will not focus without user click.
canvas.addEventListener("click", () => requestAnimationFrame(update), {
  once: true,
});
ctx.font = "16px arial";
ctx.textAlign = "center";
ctx.fillText("Click to focus keyboard", canvas.width / 2, canvas.height / 2);

const player = {
  x: 0,
  y: 0,
  w: 10,
  h: 10,
  speed: 5,
  draw() {
    ctx.fillRect(player.x, player.y, player.w, player.h);
  },
  move() {
    if (keys.ArrowUp) {
      player.y -= player.speed;
    }
    if (keys.ArrowDown) {
      player.y += player.speed;
    }
    if (keys.ArrowRight) {
      player.x += player.speed;
    }
    if (keys.ArrowLeft) {
      player.x -= player.speed;
    }
    if (player.y < 0) {
      player.y = 0;
    }
    if (player.y + player.h > canvas.height) {
      player.y = canvas.height - player.h;
    }
    if (player.x + player.w > canvas.width) {
      player.x = canvas.width - player.w;
    }
    if (player.x < 0) {
      player.x = 0;
    }
  },
};

function update() {
  if (frameCount % (60 / frameRate) === 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.move();
    player.draw();
    if (!keys.anykey) {
      ctx.fillText("Arrow keys to move!", canvas.width / 2, canvas.height / 2);
    }
  }
  frameCount += 1;
  requestAnimationFrame(update);
}
