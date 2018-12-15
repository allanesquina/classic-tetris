export default class GameZone {
  constructor(game, initialState) {
    this.state = initialState || {};
    this.objs = [];
    this.connect = this.connect.bind(this);
    this.context = game.context;
    this.renderIsRunning = false;
    this.event = game.event;
    this.gameObject = game;
    // this.a = new Audio('audio/music1.ogg');
    // this.a.volume = 1;
    // this.a.play();
  }

  connect(gameObject) {
    const index = this.objs.push(gameObject);

    gameObject.setDisconnectFn(() => {
      this.objs.splice(index-1, 1);
    }, this.context);
  }

  dispatchOnInitEvent() {
    this.objs.forEach((obj) => {
     (obj.onInit && obj.onInit(this.gameObject.getGameEventObject()));
    });
  }

  dispatchOnDestroyEvent() {
    this.objs.forEach((obj) => {
     (obj.onDestroy && obj.onDestroy(this.gameObject.getGameEventObject()));
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
