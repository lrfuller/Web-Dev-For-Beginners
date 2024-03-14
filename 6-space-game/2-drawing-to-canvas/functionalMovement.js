class GameObject {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
  }

  moveTo(x, y) {
    this.x = x;
    this.y = y;
    redrawScreen();
  }
}

class CanWalk extends GameObject {
  constructor(x, y, type) {
    super(x, y, type);
  }

  moveLeft() {
    this.x = this.x - 25;
    redrawScreen();
  }

  moveRight() {
    this.x = this.x + 25;
    redrawScreen();
  }

  moveUp() {
    this.y = this.y - 25;
    redrawScreen();
  }

  moveDown() {
    this.y = this.y + 25;
    redrawScreen();
  }
}

class CanRandomWalk extends CanWalk {
  constructor(x, y, type) {
    super(x, y, type);
  }

  randomMove() {
    switch (Math.floor(Math.random() * 6)) {
      case 0:
        this.moveLeft();
        break;
      case 1:
        this.moveDown();
        break;
      case 2:
        this.moveUp();
        break;
      case 3:
        this.moveRight();
        break;
      default:
        break;
    }
  }
}

class Hero extends CanWalk {
  constructor(x, y) {
    super(x, y, "Hero");
  }
}

class Npc extends CanRandomWalk {
  constructor(x, y) {
    super(x, y, "Npc");
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

function redrawScreen() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "gray";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "yellow";
  ctx.fillRect(hero.x, hero.y, 48, 48);

  ctx.fillStyle = "red";
  ctx.fillRect(redNpc.x, redNpc.y, 48, 48);

  ctx.fillStyle = "blue";
  ctx.fillRect(blueNpc.x, blueNpc.y, 48, 48);
}

const Messages = {
  HERO_MOVE_LEFT: "HERO_MOVE_LEFT",
  HERO_MOVE_RIGHT: "HERO_MOVE_RIGHT",
  HERO_MOVE_UP: "HERO_MOVE_UP",
  HERO_MOVE_DOWN: "HERO_MOVE_DOWN",
};

const eventEmitter = new EventEmitter();

const hero = new Hero(201, 51);
const redNpc = new Npc(151, 201);
const blueNpc = new Npc(301, 251);

redrawScreen();

eventEmitter.on(Messages.HERO_MOVE_LEFT, () => {
  hero.moveLeft();
  redNpc.randomMove();
  blueNpc.randomMove();
});

eventEmitter.on(Messages.HERO_MOVE_RIGHT, () => {
  hero.moveRight();
  redNpc.randomMove();
  blueNpc.randomMove();
});

eventEmitter.on(Messages.HERO_MOVE_UP, () => {
  hero.moveUp();
  redNpc.randomMove();
  blueNpc.randomMove();
});

eventEmitter.on(Messages.HERO_MOVE_DOWN, () => {
  hero.moveDown();
  redNpc.randomMove();
  blueNpc.randomMove();
});

window.addEventListener("keyup", (evt) => {
  if (evt.key === "ArrowLeft") {
    eventEmitter.emit(Messages.HERO_MOVE_LEFT);
  }
  if (evt.key === "ArrowRight") {
    eventEmitter.emit(Messages.HERO_MOVE_RIGHT);
  }
  if (evt.key === "ArrowUp") {
    eventEmitter.emit(Messages.HERO_MOVE_UP);
  }
  if (evt.key === "ArrowDown") {
    eventEmitter.emit(Messages.HERO_MOVE_DOWN);
  }
});
