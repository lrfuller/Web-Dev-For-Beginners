const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const PLAYER_SIZE = 100;
const FOOD_SIZE = 50;
const BACKGROUND_CANVAS_COLOR = "pink";

class GameObject {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.color = "black";
    this.dead = false;
    this.width = FOOD_SIZE;
    this.height = FOOD_SIZE;
    this.type = type;
    this.img = undefined;
  }

  draw(ctx, color) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = color;
  }

  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height,
      right: this.x + this.width,
    };
  }

  removeFromBoard() {
    this.height = 0;
    this.width = 0;
  }
}

class Movable extends GameObject {
  constructor(x, y, type) {
    super(x, y, type);
    (this.width = PLAYER_SIZE), (this.height = PLAYER_SIZE);
    this.type = "Hero";
    this.speed = { x: 0, y: 0 };
    this.points = 0;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
  }

  moveLeft() {
    this.x = this.x - 15;
    moveSnake();
  }

  moveRight() {
    this.x = this.x + 15;
    moveSnake();
  }

  moveUp() {
    this.y = this.y - 15;
    moveSnake();
  }

  moveDown() {
    this.y = this.y + 15;
    moveSnake();
  }

  isDead() {
    this.life--;
    if (this.life === 0) {
      this.dead = true;
    }
  }
}
class Hero extends Movable {
  constructor(x, y) {
    super(x, y, "Hero");
  }
}

class EventEmitter {
  constructor() {
    this.listeners = {};
  }

  on(message, listener) {
    if (!this.listeners[message]) {
      this.listeners[message] = [];
    }
    this.listeners[message].push(listener);
  }

  emit(message, payload = null) {
    if (this.listeners[message]) {
      this.listeners[message].forEach((l) => l(message, payload));
    }
  }
}
const Messages = {
  HERO_MOVE_LEFT: "HERO_MOVE_LEFT",
  HERO_MOVE_RIGHT: "HERO_MOVE_RIGHT",
  HERO_MOVE_UP: "HERO_MOVE_UP",
  HERO_MOVE_DOWN: "HERO_MOVE_DOWN",
  PLAYER2_MOVE_LEFT: "PLAYER2_MOVE_LEFT",
  PLAYER2_MOVE_RIGHT: "PLAYER2_MOVE_RIGHT",
  PLAYER2_MOVE_UP: "PLAYER2_MOVE_UP",
  PLAYER2_MOVE_DOWN: "PLAYER2_MOVE_DOWN",
  PLAYER3_MOVE_LEFT: "PLAYER3_MOVE_LEFT",
  PLAYER3_MOVE_RIGHT: "PLAYER3_MOVE_RIGHT",
  PLAYER3_MOVE_UP: "PLAYER3_MOVE_UP",
  PLAYER3_MOVE_DOWN: "PLAYER3_MOVE_DOWN",
  COLLISION_SNACK: "COLLISION_SNACK",
};
let gameObjects = [],
  eventEmitter = new EventEmitter();

eventEmitter.on(Messages.HERO_MOVE_LEFT, () => {
  hero.moveLeft();
});
eventEmitter.on(Messages.HERO_MOVE_RIGHT, () => {
  hero.moveRight();
});
eventEmitter.on(Messages.HERO_MOVE_UP, () => {
  hero.moveUp();
});
eventEmitter.on(Messages.HERO_MOVE_DOWN, () => {
  hero.moveDown();
});

window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.HERO_MOVE_LEFT);
  }
});
window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.HERO_MOVE_RIGHT);
  }
});
window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.HERO_MOVE_UP);
  }
});
window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.HERO_MOVE_DOWN);
  }
});
window.addEventListener("keydown", (evt) => {
  if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.HERO_MOVE_LEFT);
  }
});
window.addEventListener("keydown", (evt) => {
  if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.HERO_MOVE_RIGHT);
  }
});
window.addEventListener("keydown", (evt) => {
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.HERO_MOVE_UP);
  }
});
window.addEventListener("keydown", (evt) => {
  if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.HERO_MOVE_DOWN);
  }
});

let onKeyDown = function (e) {
  // console.log(e.keyCode);
  switch (e.keyCode) {
    case 37:
    case 39:
    case 38:
    case 40: // Arrow keys
    case 32:
      e.preventDefault();
      break; // Space
    default:
      break; // do not block other keys
  }
};

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}

function isSnackEaten() {
  const snacks = gameObjects.filter((go) => go.type === "SNACK" && !go.dead);
  return snacks.length === 0;
}

eventEmitter.on(Messages.COLLISION_SNACK, (_, { snack }) => {
  snack.dead = true;
});

function updateGameObjects() {
  const snacks = gameObjects.filter((go) => go.type === "SNACK");

  snacks.forEach((snack) => {
    const heroRect = hero.rectFromGameObject();
    if (intersectRect(heroRect, snack.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_SNACK, { snack });
    }
  });

  gameObjects.map((obj) => {
    if (obj.dead == true) {
      obj.removeFromBoard();
      hero.width += 20;
      hero.height += 20;
    }
  });
  gameObjects = gameObjects.filter((go) => !go.dead);
}

window.addEventListener("keydown", onKeyDown);
const hero = new Hero(658, 10);
const food1 = new GameObject(10, 10, "SNACK");
const food2 = new GameObject(10, 200, "SNACK");

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}
function drawGameObjects(ctx) {
  gameObjects.forEach((go) => go.draw(ctx, go.color));
}

function moveSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "green";
  // if (hero.y < 0) {
  //   hero.y = 0;
  // }
  // if (hero.y > 668) {
  //   hero.y = 668;
  // }
  // if (hero.x < 0) {
  //   hero.x = 0;
  // }
  // if (hero.x > 668) {
  //   hero.x = 668;
  // }
  ctx.fillRect(hero.x, hero.y, hero.width, hero.height);

  updateGameObjects();
  drawGameObjects(ctx);
}

gameObjects.push(hero);
gameObjects.push(food1);
gameObjects.push(food2);

moveSnake();
