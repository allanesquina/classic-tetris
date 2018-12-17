export default class GameZone {
  constructor(game, initialState) {
    this.state = initialState || {};
    this.objs = {};
    this.connect = this.connect.bind(this);
    this.context = game.context;
    this.renderIsRunning = false;
    this.event = game.event;
    this.gameObject = game;
    this.index = 0;
    this.isActive = false;
    // this.a = new Audio('audio/music1.ogg');
    // this.a.volume = 1;
    // this.a.play();
    this.getObject = this.getObject.bind(this);
    this.changeObjectId = this.changeObjectId.bind(this);
  }

  connect(gameObject) {
    // const index = `a${this.index++}`;
    const index = gameObject.props.id;

    this.objs[index] = gameObject;

    gameObject.setDisconnectFn(() => {
      gameObject.onDestroy();
      delete this.objs[index];
    }, this.context);

    if(this.gameObject.renderIsRunning && this.isActive) {
      (gameObject.onInit && gameObject.onInit(this.gameObject.getGameEventObject()));
    }
  }

  getObject(id) {
    const keys = Object.keys(this.objs);
    for ( let i = 0, l = keys.length; i < l; i++) {
      const obj = this.objs[keys[i]];
      if(obj && obj.props.id === id) {
        return obj;
      }
    }

    return false;
  }

  changeObjectId(obj, newId) {
    if(obj) {
      const old = obj.props.id;
      obj.props.id = newId;
      this.objs[newId] = obj;
      delete this.objs[old];
    }
  }

  

  dispatchOnInitEvent() {
    Object.keys(this.objs).forEach((obj) => {
      (this.objs[obj].onInit && this.objs[obj].onInit(this.gameObject.getGameEventObject()));
    });
  }

  dispatchOnDestroyEvent() {
    Object.keys(this.objs).forEach((obj) => {
      (this.objs[obj].onDestroy && this.objs[obj].onDestroy(this.gameObject.getGameEventObject()));
    });
  }

  setState(newState) {
    for (var k in newState) {
      if (newState.hasOwnProperty(k)) {
        this.state[k] = newState[k];
      }
    }
  }

}
