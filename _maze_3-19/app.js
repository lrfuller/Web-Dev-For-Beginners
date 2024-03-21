const c = document.getElementById("canvas");
const ctx = c.getContext("2d");
const points = document.getElementById("points");
const lives = document.getElementById("lives");
const PLAYER_SIZE = 100;
const FOOD_SIZE = 50;
const BACKGROUND_CANVAS_COLOR = "pink";

class GameObject {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.color = "black";
    this.dead = false;
    this.width = width;
    this.height = height;
    this.type = "WALL";
  }

  draw(ctx, color) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = color;
  }

  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height - 10,
      right: this.x + this.width - 10,
    };
  }

  removeFromBoard() {
    this.height = 0;
    this.width = 0;
    this.x = -500;
    this.y = -500;
  }
}

class Cash extends GameObject {
  constructor(x, y, width, height) {
    super(x, y);
    this.type = "CASH";
    this.color = "green";
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
  }
}

class Movable extends GameObject {
  constructor(x, y, type) {
    super(x, y, type);
    (this.width = PLAYER_SIZE), (this.height = PLAYER_SIZE);
    this.type = "Hero";
    this.color = "green";
    this.speed = { x: 0, y: 0 };
    this.life = 5;
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
}
class Hero extends Movable {
  constructor(x, y) {
    super(x, y, "Hero");
  }
  draw(ctx, color) {
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.fillStyle = color;
  }
  rectFromGameObject() {
    return {
      top: this.y,
      left: this.x,
      bottom: this.y + this.height - 20,
      right: this.x + this.width - 20,
    };
  }
  isDead() {
    this.life--;
    hero.x = 638;
    hero.y = 30;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //TODO loose life

    if (this.life === 0) {
      this.dead = true;
      hero.removeFromBoard();
    }
  }
  scorePoint() {
    this.points += 10;
    //TODO score points on screen
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
  COLLISION_WALL: "COLLISION_WALL",
  COLLISION_POINT: "COLLISION_POINT",
};
let gameObjects = [],
  gameObjects_Original = [],
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
eventEmitter.on(Messages.COLLISION_WALL, (_, { wall }) => {
  hero.isDead();
});
eventEmitter.on(Messages.COLLISION_POINT, (_, { wall }) => {
  hero.scorePoint();
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

function updateGameObjects() {
  const walls = gameObjects.filter((go) => go.type === "WALL");
  const cash = gameObjects.filter((go) => go.type === "CASH");
  const heroRect = hero.rectFromGameObject();

  walls.forEach((wall) => {
    if (intersectRect(heroRect, wall.rectFromGameObject())) {
      eventEmitter.emit(Messages.COLLISION_WALL, { wall });
    }
  });

  // cash.forEach((cash) => {
  //   if (intersectRect(heroRect, cash.rectFromGameObject())) {
  //     eventEmitter.emit(Messages.COLLISION_POINT, { cash });
  //   }
  // });
}

window.addEventListener("keydown", onKeyDown);
const hero = new Hero(638, 30);

const horizontal1 = new GameObject(0, 748, 768, 20);
const horizontal2 = new GameObject(0, 0, 768, 20);
const horizontal3 = new GameObject(350, 150, 400, 20);
const horizontal4 = new GameObject(0, 550, 600, 20);
const horizontal5 = new GameObject(150, 330, 270, 20);

const veritcal1 = new GameObject(0, 350, 20, 200);
const veritcal2 = new GameObject(0, 0, 20, 400);
const veritcal3 = new GameObject(748, 0, 20, 748);
const veritcal4 = new GameObject(350, 150, 20, 200);
const veritcal5 = new GameObject(200, 0, 20, 180);
const veritcal6 = new GameObject(580, 350, 20, 200);
const veritcal7 = new GameObject(0, 0, 20, 400);

const money1 = new Cash(100, 100, 50, 50);

gameObjects.push(money1);
gameObjects.push(hero);
gameObjects.push(veritcal1);
gameObjects.push(veritcal2);
gameObjects.push(veritcal3);
gameObjects.push(veritcal4);
gameObjects.push(veritcal5);
gameObjects.push(veritcal6);
gameObjects.push(horizontal1);
gameObjects.push(horizontal2);
gameObjects.push(horizontal3);
gameObjects.push(horizontal4);
gameObjects.push(horizontal5);

gameObjects_Original = gameObjects;

//TODO
function winCondition() {
  if (hero.x < 10 && hero.y < 500 && hero.y < 748) {
  }
}

function intersectRect(r1, r2) {
  return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
  );
}
function drawGameObjects(ctx) {
  console.log(gameObjects);
  gameObjects.forEach((go) => go.draw(ctx, go.color));
}

function moveSnake() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "teal";

  ctx.fillRect(hero.x, hero.y, hero.width, hero.height);

  updateGameObjects();
  drawGameObjects(ctx);
}

moveSnake();
