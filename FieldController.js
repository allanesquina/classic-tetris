class FieldController extends GameObject {
  constructor(props) {
    super(props);
    this._createMatrix();
    this.types = [`T`, `O`, `I`];
    this.interval = null;
  }

  _createMatrix() {
    this.props.matrix = [];
    for (let i = 0, l = 22; i < l; i++) {
      for (let j = 0, y = 10; j < y; j++) {
        this.props.matrix[i] = this.props.matrix[i] || [];
        this.props.matrix[i][j] = { filled: 0 };
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
    pieces['O'][0] = [[y, x], [y, x + 1], [y + 1, x], [y + 1, x + 1]];
    pieces['O'][1] = pieces['O'][0];
    pieces['O'][2] = pieces['O'][0];
    pieces['O'][3] = pieces['O'][0];

    pieces['I'] = [];
    pieces['I'][0] = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
    pieces['I'][1] = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
    pieces['I'][2] = pieces['I'][0];
    pieces['I'][3] = pieces['I'][1];

    return pieces[type][rotate];
  }

  onEnterFrame(game) {
    if (!this.interval) {
      this.interval = setInterval(() => this._movePiece(null, game), 500);
      this._movePiece(null, game)
    }
  }

  onKeyUp(e, game) {
  }

  onKeyPress(e, game) {
  }

  _validateLineScore() {
    let lines = [];
    for (let i = 0, l = 22; i < l; i++) {
      let line = 0;
      for (var j = 0, y = 10; j < y; j++) {
        line = this.props.matrix[i][j].filled > 0 ? line + 1 : line;
      }

      // Save the line which has all pieces filled
      if (line == y) {
        lines.push(i);
      }
    }
    return lines;
  }

  _emptyAllPixelsFromLine(line) {
    return line[0].map((pixel) => {
      pixel.filled = 0;
      return pixel;
    })
  }

  _removeLinesFromMatrix(lines) {
    lines.forEach((line) => {
      let rest = this.props.matrix.splice(line, 1);
      this.props.matrix.unshift(this._emptyAllPixelsFromLine(rest));
    })
  }

  _validateScore() {
    let lines = this._validateLineScore();
    this._removeLinesFromMatrix(lines);
  }

  _validate(game) {
    const p = this._getPiece(game.state.currentPiece);
    const { down } = game.state.control;
    this._removeFromMatrix(this._getPiece(game.state.oldCurrentPiecePosition));
    for (let i = 0, l = p.length; i < l; i++) {
      if (!this.props.matrix[p[i][0]]) {
        return 'out-down';
      }

      // if the piece is out of the view port X
      if (!this.props.matrix[p[i][0]][p[i][1]]) {
        return 'out';
      }
      // if the piece has collided with another piece
      if (this.props.matrix[p[i][0]][p[i][1]].filled > 0 && down) {
        return 'colision';
      }

      if (this.props.matrix[p[i][0]][p[i][1]].filled > 0 && !down) {
        return 'out';
      }
    }

    return 'bypass';
  }

  _removeFromMatrix(p) {
    for (let i = 0, l = p.length; i < l; i++) {
      if (this.props.matrix[p[i][0]] && this.props.matrix[p[i][0]][p[i][1]]) {
        this.props.matrix[p[i][0]][p[i][1]].filled = 0;
      }
    }
  }

  _pushToMatrix(p) {
    for (let i = 0, l = p.length; i < l; i++) {
      if (this.props.matrix[p[i][0]] && this.props.matrix[p[i][0]][p[i][1]]) {
        this.props.matrix[p[i][0]][p[i][1]].filled = 1;
      }
    }
  }

  onKeyDown(e, game) {
    this._movePiece(e, game);
  }

  _movePiece(e, game) {
    let {y, x, rotate, type} = game.state.currentPiece;
    const oldCurrentPiecePosition = game.state.currentPiece;
    type = type || thie.types[getRandomInt(0, 3)];
    let down = false;

    if (e) {
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
        down = true;
      }
      // space
      if (e.keyCode === 32) {
        rotate = rotate === 3 ? 0 : rotate + 1;
      }
    } else {
      y = y + 1;
      down = true;
    }

    game.setState({
      control: { down },
      currentPiece: { type, rotate, x, y },
      oldCurrentPiecePosition,
      matrix: Object.assign(this.props.matrix)
    });

    let validateResult = this._validate(game);

    if (validateResult === 'out-down') {
      this._pushToMatrix(this._getPiece(oldCurrentPiecePosition));
      this._validateScore();
      game.setState({
        currentPiece: { type: this.types[getRandomInt(0, 3)], rotate: 0, x: 3, y: 0 },
        oldCurrentPiecePosition: game.state.currentPiece,
        matrix: Object.assign(this.props.matrix)
      });
      return;
    }

    if (validateResult === 'out') {
      this._pushToMatrix(this._getPiece(oldCurrentPiecePosition));
      game.setState({
        matrix: Object.assign(this.props.matrix),
        currentPiece: oldCurrentPiecePosition
      });
      return;
    }

    if (validateResult === 'colision') {
      this._pushToMatrix(this._getPiece(oldCurrentPiecePosition));
      this._validateScore();
      game.setState({
        currentPiece: { type: this.types[getRandomInt(0, 3)], rotate: 0, x: 3, y: 0 },
        oldCurrentPiecePosition: game.state.currentPiece,
        matrix: Object.assign(this.props.matrix)
      });
      return;
    }

    if (validateResult === 'bypass') {
      this._pushToMatrix(this._getPiece(game.state.currentPiece));
      game.setState({
        matrix: Object.assign(this.props.matrix)
      });
      return;
    }
    game.setState({
      matrix: Object.assign(this.props.matrix)
    });
  }
}
