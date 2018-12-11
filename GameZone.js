class GameZone {
  constructor(context, initialState) {
    this.state = initialState || {};
    this.objs = [];
    this.connect = this.connect.bind(this);
    this.context = context;
    this.renderIsRunning = false;
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

  setState(newState) {
    for (var k in newState) {
      if (newState.hasOwnProperty(k)) {
        this.state[k] = newState[k];
      }
    }
  }
}
