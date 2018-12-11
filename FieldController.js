const throttle = (func, limit) => {
    let inThrottle
    return function() {
        const args = arguments
        const context = this
        if (!inThrottle) {
              func.apply(context, args)
              inThrottle = true
          setTimeout(() => inThrottle = false, limit)
            }
      }
  }

class FieldController extends GameObject {
  constructor(props, game) {
    super(props);

    this.props = props;
    this.props.matrix = this._createMatrix(10, 22);
    this.props.matrixNext = this._createMatrix(4, 6);

    this.types = [`T`, `O`, `I`, `S`, `Z`, `L`, `J`];
    this.interval = null;
    this.paused = false;
    this.audioRotate = new Audio('audio/rotate.wav');
    this.audioMove = new Audio('audio/move.wav');
    this.audioDrop = new Audio('audio/drop.ogg');
    this.audioLineSingle = new Audio('audio/single.ogg');
    this.audioLineDouble = new Audio('audio/double.ogg');
    this.audioLineTriple = new Audio('audio/triple.ogg');
    this.audioLineTetris = new Audio('audio/tetris.ogg');
    this.audioRotate.volume = .4;
    this.audioMove.volume = .2;
    this.audioDrop.volume = .5;
    this.audioLineSingle.volume = .5;
    this.audioLineDouble.volume = .5;
    this.audioLineTriple.volume = .5;
    this.audioLineTetris.volume = .5;

    this._handleNextPiece(game);

    this.delayBlock150 = throttle((cb) => {
      cb();
    }, 150);

    this.delayBlock50 = throttle((cb) => {
      cb();
    }, 50);
  }

  _createMatrix(width, height) {
    let matrix = [];
    for (let i = 0, l = height ; i < l; i++) {
      for (let j = 0, y = width; j < y; j++) {
        matrix[i] = matrix[i] || [];
        matrix[i][j] = { filled: 0 };
      }
    }
    return matrix;
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

    pieces['S'] = [];
    pieces['S'][0] = [[y, x], [y, x + 1], [y + 1, x - 1], [y + 1, x]];
    pieces['S'][1] = [[y, x], [y + 1, x], [y + 1, x + 1], [y + 2, x + 1]];
    pieces['S'][2] = pieces['S'][0];
    pieces['S'][3] = pieces['S'][1];

    pieces['Z'] = [];
    pieces['Z'][0] = [[y, x], [y, x - 1], [y + 1, x], [y + 1, x + 1]];
    pieces['Z'][1] = [[y, x], [y + 1, x], [y + 1, x - 1], [y + 2, x - 1]];
    pieces['Z'][2] = pieces['Z'][0];
    pieces['Z'][3] = pieces['Z'][1];

    pieces['L'] = [];
    pieces['L'][0] = [[y, x], [y, x - 1], [y, x + 1], [y + 1, x - 1]];
    pieces['L'][1] = [[y, x], [y, x - 1], [y + 1, x], [y + 2, x]];
    pieces['L'][2] = [[y, x + 1], [y + 1, x], [y + 1, x - 1], [y + 1, x + 1]];
    pieces['L'][3] = [[y, x], [y + 1, x], [y + 2, x], [y + 2, x + 1]];

    pieces['J'] = [];
    pieces['J'][0] = [[y, x], [y, x - 1], [y, x + 1], [y + 1, x + 1]];
    pieces['J'][1] = [[y, x], [y + 1, x], [y + 2, x], [y + 2, x - 1]];
    pieces['J'][2] = [[y, x - 1], [y + 1, x], [y + 1, x - 1], [y + 1, x + 1]];
    pieces['J'][3] = [[y, x], [y, x + 1], [y + 1, x], [y + 2, x]];

    return pieces[type][rotate];
  }

  onEnterFrame(game) {
    if (this.paused) {
      if (this.isRemovingLines) {
        if (Date.now() % 2 === 0) {
          this.currentPixel = this.currentPixel > 0 ? this.currentPixel : 0;
          this._walkThroughLinesToBeRemoved(this.currentPixel);

          if (this.currentPixel === 11) {
            this._removeLinesFromMatrix(this.linesToBeRemoved);
            this.currentPixel = 0;
            this.paused = false;
            this.isRemovingLines = false;
            this._changeScore(this.linesToBeRemoved.length, game);
            this._updateLines(this.linesToBeRemoved.length, game);
          } else {
            this.currentPixel++;
          }

        }
      }
    } else {
      if (!this.interval) {
        this.interval = setInterval(() => this._movePiece(null, game), 500);
        this._movePiece(null, game)
      }
    }
  }
  _updateLines(linesNumber, game) {
    let lines = parseInt(game.state.lines);
    lines = lines + linesNumber;
    game.setState({lines});
  }

  _changeScore(linesNumber, game) {
    let score = parseInt(game.state.score);
    switch(linesNumber) {
      case 1:
        score += 1000;
        break;
      case 2:
        score += 2000;
        break;
      case 3:
        score += 3000;
        break;
      case 4:
        score += 4000;
        break;
        default:
        break;
    }

    game.setState({score});

  }

  _walkThroughLinesToBeRemoved(pixel) {
    for (let i = 0, l = this.linesToBeRemoved.length; i < l; i++) {
      pixel = (i + 1) % 2 === 1 ? 10 - pixel : pixel;
      this._emptyPixelFromLine(pixel, this.props.matrix[this.linesToBeRemoved[i]]);
    }
  }

  _emptyPixelFromLine(pixel, line) {
    if (line[pixel]) {
      line[pixel].filled = 0;
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

  _setLinesToBeremoved(lines) {
    this.linesToBeRemoved = lines;
  }

  _removeLinesFromMatrix(lines) {
    lines.forEach((line) => {
      let rest = this.props.matrix.splice(line, 1);
      this.props.matrix.unshift(this._emptyAllPixelsFromLine(rest));
    })
  }

  _startRemoveLinesFromMatrixAnimation() {
    this.paused = true;
    this.isRemovingLines = true;
    switch (this.linesToBeRemoved.length) {
      case 1:
        this.audioLineSingle.currentTime = 0;
        this.audioLineSingle.play();
        break;
      case 2:
        this.audioLineDouble.currentTime = 0;
        this.audioLineDouble.play();
        break;
      case 3:
        this.audioLineTriple.currentTime = 0;
        this.audioLineTriple.play();
        break;
      case 4:
        this.audioLineTetris.currentTime = 0;
        this.audioLineTetris.play();
        break;
      default:
    }
  }

  _validateScore() {
    let lines = this._validateLineScore();
    if (lines.length > 0) {
      this._setLinesToBeremoved(lines);
      this._startRemoveLinesFromMatrixAnimation();
    }
  }

  _validate(game) {
    const p = this._getPiece(game.state.currentPiece);
    const { down } = game.state.control;

    for (let i = 0, l = p.length; i < l; i++) {
      if (!this.props.matrix[p[i][0]]) {
        return 'out-down';
      }

      // if the piece is out of the view port y
      if (!this.props.matrix[p[i][0]][p[i][1]]) {
        return 'out';
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

  _removeFromMatrix(p, matrix = this.props.matrix) {
    for (let i = 0, l = p.length; i < l; i++) {
      if (matrix[p[i][0]] && matrix[p[i][0]][p[i][1]]) {
        matrix[p[i][0]][p[i][1]].filled = 0;
      }
    }
  }

  _pushToMatrix(piece, matrix = this.props.matrix) {
    const p = this._getPiece(piece);
    for (let i = 0, l = p.length; i < l; i++) {
      if (matrix[p[i][0]] && matrix[p[i][0]][p[i][1]]) {
        matrix[p[i][0]][p[i][1]].filled = 1;
        matrix[p[i][0]][p[i][1]].type = piece.type;
      }
    }
  }

  onKeyDown(keys, game) {
    if(keys.isPressed) {
      this._movePiece(keys, game);
    }
  }

  _randomPiece() {
    return { type: this.types[getRandomInt(0, this.types.length)], rotate: 0, x: 0, y: 0 };
  }

  _handleNextPiece(game) {
    this.nextPiece = this.nextPiece || this._randomPiece();
    const piece = this.nextPiece;


    this.nextPiece.x = 1;
    this.nextPiece.y = 1;

    this._removeFromMatrix(this._getPiece(this.nextPiece), this.props.matrixNext);

    this.nextPiece = this._randomPiece();

    this.nextPiece.x = 1;
    this.nextPiece.y = 1;

    this._pushToMatrix(this.nextPiece, this.props.matrixNext);

    piece.x = 4;
    piece.y = -1;

    game.setState({
      currentPiece: piece,
      oldCurrentPiecePosition: piece,
      matrixNext: Object.assign(this.props.matrixNext),
      matrix: Object.assign(this.props.matrix)
    });
  }

  _newPiece(game) {
    this._handleNextPiece(game);

    const validateResult = this._validate(game);

    if (validateResult === 'colision') {
      this.paused = true;
      console.log(`gameover`);
    }
  }

  _movePiece(keys, game) {
    if (this.paused) return false;

    let {y, x, rotate, type} = game.state.currentPiece;
    const oldCurrentPiecePosition = game.state.currentPiece;
    type = type || this.types[getRandomInt(0, 4)];
    let down = false;
    let audio = this.audioMove;

    if (keys) {
      this.delayBlock50(() => {
        // >
        if (keys[76] || keys[39]) {
          x = x + 1;
        }

        // <
        if (keys[72] || keys[37]) {
          x = x - 1;
        }
        // down or space
        if (keys[74] || keys[32] || keys[40]) {
          y = y + 1;
          down = true;
        }
      });
      // up
      if (keys[38] || keys[75]) {
        this.delayBlock150(() => {
          rotate = rotate === 3 ? 0 : rotate + 1;
          audio = this.audioRotate;
        });
      }
    } else {
      y = y + 1;
      down = true;
      audio = null;
    }

    // Play audio effect
    if(audio) {
      audio.currentTime = 0;
      // audio.play();
    }

    game.setState({
      control: { down },
      currentPiece: { type, rotate, x, y },
      oldCurrentPiecePosition,
      matrix: Object.assign(this.props.matrix)
    });

    this._removeFromMatrix(this._getPiece(game.state.oldCurrentPiecePosition));

    let validateResult = this._validate(game);

    if (validateResult === 'out-down') {
      this._pushToMatrix(oldCurrentPiecePosition);
      this._validateScore();
      this._newPiece(game);
      this.audioDrop.currentTime = 0;
      this.audioDrop.play();
      return;
    }

    if (validateResult === 'out') {
      this._pushToMatrix(oldCurrentPiecePosition);
      game.setState({
        matrix: Object.assign(this.props.matrix),
        currentPiece: oldCurrentPiecePosition
      });
      return;
    }

    if (validateResult === 'colision') {
      this._pushToMatrix(oldCurrentPiecePosition);
      this._validateScore();
      this._newPiece(game);
      this.audioDrop.currentTime = 0;
      this.audioDrop.play();
      return;
    }

    if (validateResult === 'bypass') {
      this._pushToMatrix(game.state.currentPiece);
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
