import PubSub from '../jps';
import GameZone from './GameZone';
import GameObject from './GameObject';

export default class Game {
  constructor(id, w, h, fps) {
    this.canvas = document.getElementById(id || 'stage');
    this.canvas.width = w;
    this.canvas.height = h;
    this.context = this.canvas.getContext('2d');
    this.context.imageSmoothingEnabled = false;
    this.lastTime = Date.now() / 1000;
    this.fps = fps ? (0.013 / fps) * 60 : 0.013; // 60fps
    this.stages = {};
    this.state = {
      stage: {
        height: h,
        width: w,
      }
    };

    this.renderIsRunning = false;
    this.pressedKeys = { count: 0 };
    this.render = this.render.bind(this);
    this.walkThroughGameObjects = this.walkThroughGameObjects.bind(this);

    this.bindEvents();
    this.event = new PubSub();
  }

  getGameEventObject() {
    const zone = this.zone ? this.zone : {};
    return {
      state: zone.state,
      setState: zone.setState,
      connect: zone.connect,
      globalState: this.state,
      setGlobalState: this.setState,
      event: this.event,
      objlength: Object.keys(this.zone.objs).length,
    };
  }

  bindEvents() {
    document.addEventListener('keydown', (e) => {
      e.preventDefault();
      this.pressedKeys[e.keyCode] = e;
      this.pressedKeys.isPressed = true;
    });

    document.addEventListener('keyup', (e) => {
      e.preventDefault();
      this.pressedKeys[e.keyCode] = false;
      this.pressedKeys.isPressed = false;
    });
  }

  cicle() {
    window.requestAnimationFrame(this.render);
  }

  start() {
    this.renderIsRunning = true;
    this.render();
  }

  render() {
    const time = Date.now() / 1000;
    if (time > this.lastTime + this.fps) {
      this.lastTime = time;
      // this.context.clearRect(0, 0, this.state.stage.width, this.state.stage.height);
      // this.canvas.width = this.canvas.width;
      this.walkThroughGameObjects((obj, i) => {
        (obj.stateToProp && obj.stateToProp(this.getGameEventObject()));
        (obj.onKeyDown && obj.onKeyDown(this.pressedKeys, this.getGameEventObject()));
        (obj.onEnterFrame && obj.onEnterFrame(this.getGameEventObject()));

        if(obj.shouldRender) {
          if(obj.shouldRender()) {
            obj.render(this.context, this.state);
          }
        } else {
          obj.render(this.context, this.state);
        }

        (obj.onCollision && obj.onCollision(this.collisionCalc(obj, i), this.getGameEventObject()));
      });
    }

    this.cicle();
  }

  walkThroughGameObjects(fn) {
    const objs = this.zone.objs;
    const objsKeys = Object.keys(objs);

    for (let i=0, l = objsKeys.length; i < l; i += 1) {
      const obj = objs[objsKeys[i]];
      if (obj) {
        fn(obj, i);
      }
    }
  }

  activeStage(stage) {
    let nextStage;

    if(Object.prototype.toString.call(stage) === '[object String]') {
      nextStage = this.stages[stage];
    } else {
      nextStage = this.stages[stage.name];
    }

    if(nextStage) {
      if(this.zone) {
        this.zone.isActive = false;
        this.zone.dispatchOnDestroyEvent();
      }
      this.zone = nextStage;
      this.zone.isActive = true;
      this.zone.dispatchOnInitEvent();
      return;
    }

    throw new Error(`Can not find stage ${stage}`);

  }

  setState(newState) {
    for (var k in newState) {
      if (newState.hasOwnProperty(k)) {
        this.state[k] = newState[k];
      }
    }
  }

  collisionCalc(target, index) {
    let out = [];
    this.walkThroughGameObjects((obj, i) => {
      if (
        (target.props.x + target.props.w) >= obj.props.x &&
        target.props.x <= (obj.props.x + obj.props.w) &&
        target.props.y <= (obj.props.y + obj.props.h) &&
        (target.props.y + target.props.h) >= obj.props.y &&
        index !== i
      ) {
        out.push(obj);
      }
    });
    return out;
  }

  stage(name, state) {
    const stage = new GameZone(this, state);
    this.stages[name] = stage;
    stage.name = name;
    return stage; 
  }

  object(props) {
    return new GameObject(props)
  }


};

Game.GameObject = GameObject;
