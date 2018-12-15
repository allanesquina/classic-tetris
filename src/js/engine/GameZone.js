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
  }

  connect(gameObject) {
    const index = `a${this.index++}`;

    this.objs[index] = gameObject;

    gameObject.setDisconnectFn(() => {
      gameObject.onDestroy();
      delete this.objs[index];
    }, this.context);

    if(this.gameObject.renderIsRunning && this.isActive) {
      (gameObject.onInit && gameObject.onInit(this.gameObject.getGameEventObject()));
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
