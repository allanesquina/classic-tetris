class FieldController extends GameObject {
  constructor(props) {
    super(props);
    this._createMatrix();
    this.types = [`T`, `O`];
  }

  _createMatrix() {
    this.props.matrix = [];
    for (let i = 0, l = 22; i < l; i++) {
      for (let j = 0, y = 10; j < y; j++) {
        this.props.matrix[i] = this.props.matrix[i] || [];
        this.props.matrix[i][j] = { filled: 0, current: 0 };
      }
    }
  }

  _getPiece({ x, y, type, rotate }) {
    let pieces = [];
    pieces['T'] = [];
    pieces['T'][0] = [[y, x], [y + 1, x - 1], [y + 1, x], [y + 1, x + 1]];
    pieces['T'][1] = [[y, x - 1], [y + 1, x - 1], [y + 1, x], [y + 2, x - 1]];
    pieces['T'][2] = [[y, x - 1], [y, x], [y, x + 1], [y + 1, x]];
    pieces['T'][3] = [[y, x + 1], [y + 1, x], [y + 1, x + 1], [y + 2, x + 1]];

    pieces['O'] = [];
    pieces['O'][0] = [[y, x], [y, x + 1 ], [y + 1, x], [y + 1, x + 1]];
    pieces['O'][1] = pieces['O'][0];
    pieces['O'][2] = pieces['O'][0];
    pieces['O'][3] = pieces['O'][0];

    return pieces[type][rotate];
  }

  onEnterFrame(game) {
  }

  onKeyUp(e, game) {
  }

  onKeyPress(e, game) {
  }

  _validate(game) {
    const p = this._getPiece(game.state.currentPiece);
    this._removeFromMatrix(this._getPiece(game.state.oldCurrentPiecePosition));
    for (let i = 0, l = p.length; i < l; i++) {
      if (!this.props.matrix[p[i][0]]) return false;
      if (!this.props.matrix[p[i][0]][p[i][1]]) return false;
      if (this.props.matrix[p[i][0]][p[i][1]].filled > 0) {
        return false;
      }
    }
    return true;
  }

  _removeFromMatrix(p) {
    for (let i = 0, l = p.length; i < l; i++) {
      this.props.matrix[p[i][0]][p[i][1]].filled = 0;
    }
  }

  _pushToMatrix(p) {
    for (let i = 0, l = p.length; i < l; i++) {
      this.props.matrix[p[i][0]][p[i][1]].filled = 1;
    }
  }

  onKeyDown(e, game) {
    let {y, x, rotate, type} = game.state.currentPiece;
    const oldCurrentPiecePosition = game.state.currentPiece;
    type = type || thie.types[getRandomInt(0, 2)];

    // >
    if (e.keyCode === 76) {
      x = x + 1;
    }
    // <
    if (e.keyCode === 72) {
      x = x - 1;
    }
    // down
    if (e.keyCode === 74) {
      y = y + 1;
    }
    // space
    if (e.keyCode === 32) {
      rotate = rotate === 3 ? 0 : rotate + 1;
    }

    game.setState({
      currentPiece: { type, rotate, x, y },
      oldCurrentPiecePosition,
      matrix: Object.assign(this.props.matrix)
    });

    if (this._validate(game)) {
      // this._removeFromMatrix(this._getPiece(oldCurrentPiecePosition));
      this._pushToMatrix(this._getPiece(game.state.currentPiece));
      console.log(this.props.matrix)
      game.setState({
        matrix: Object.assign(this.props.matrix)
      });
      console.log(e, this.props, game.state)
    } else {
      console.log(`invalid`)
      this._pushToMatrix(this._getPiece(oldCurrentPiecePosition));
      game.setState({
        currentPiece: { type: this.types[getRandomInt(0, 2)], rotate: 0, x: 3, y: 1 },
        oldCurrentPiecePosition: game.state.currentPiece,
        matrix: Object.assign(this.props.matrix)
      });
    }
  }
}
