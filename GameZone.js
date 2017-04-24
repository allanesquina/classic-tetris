class GameZone {
  constructor(context, initialState) {
    this.state = initialState || {};
    this.objs = {};
    this.objectsIndexes = new Array(20000);
    this.objectsIndexesLength = 0;
    this.objectsIndexesToChange = new Array(200);
    this.objectsIndexesToChangeLength = 0;
    this.objectsIndexesToAdd = new Array(200);
    this.objectsIndexesToAddLength = 0;
    this.connect = this.connect.bind(this);
    this.availableKeysCount = 0;
    this.context = context;
    this.renderIsRunning = false;
    // this.a = new Audio('audio/music1.ogg');
    // this.a.volume = 1;
    // this.a.play();
  }

  connect(gameObject) {
    const index = this.getNextAvailableIndex();
    if (this.renderIsRunning) {
      this.objectsIndexesToAdd[this.objectsIndexesToAddLength++] = { index, gameObject };
    } else {
      this.objs[index] = gameObject;
      this.objectsIndexes[index] = index;
      this.objectsIndexesLength += 1;
    }
    gameObject.setDisconnectFn(() => {
      this.objectsIndexesToChange[this.objectsIndexesToChangeLength++] = index;
    }, this.context);
  }


  getNextAvailableIndex() {
    const indexes = this.objectsIndexes;
    const l = indexes.length;
    for (let i = 1; i < l; i++) {
      if (!indexes[i]) {
          return i;
      }
    }
  }

  setState(newState) {
    for (var k in newState) {
      if (newState.hasOwnProperty(k)) {
        this.state[k] = newState[k];
      }
    }
  }

  removeGameObjectIndexes() {
    const indexes = this.objectsIndexesToChange;
    const l = this.objectsIndexesToChangeLength;
    for (let i = 0; i < l; i++) {
      delete this.objs[indexes[i]];
      this.objectsIndexes[indexes[i]] = undefined;
      this.objectsIndexesLength -= 1;
    }
    this.objectsIndexesToChangeLength = 0;
  }

  addGameObjectIndexes() {
    const indexes = this.objectsIndexesToAdd;
    const l = this.objectsIndexesToAddLength;
    for (let i = 0; i < l; i++) {
      const {index, gameObject } = indexes[i];
      this.objs[index] = gameObject;
      this.objectsIndexes[index] = index;
      this.objectsIndexesLength += 1;
    }
    this.objectsIndexesToAddLength = 0;
  }


}
