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

const pieces = [];
    pieces['T'] = [
      [ 
        [0,1,0],
        [1,1,1],
        [0,0,0],
      ],
      [ 
        [0,1,0],
        [0,1,1],
        [0,1,0],
      ],
      [ 
        [0,0,0],
        [1,1,1],
        [0,1,0],
      ],
      [ 
        [0,1,0],
        [1,1,0],
        [0,1,0],
      ],
    ];

    pieces['O'] = [
      [ 
        [1,1],
        [1,1],
      ],
    ];
    pieces['O'][1] = pieces['O'][0]
    pieces['O'][2] = pieces['O'][0]
    pieces['O'][3] = pieces['O'][0]

    pieces['I'] = [
      [ 
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0],
      ],
      [ 
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
        [0,0,1,0],
      ],
      [ 
        [0,0,0,0],
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
      ],
      [ 
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
      ],
    ];

    pieces['S'] = [
      [ 
        [0,1,1],
        [1,1,0],
        [0,0,0],
      ],
      [ 
        [0,1,0],
        [0,1,1],
        [0,0,1],
      ],
      [ 
        [0,0,0],
        [0,1,1],
        [1,1,0],
      ],
      [ 
        [1,0,0],
        [1,1,0],
        [0,1,0],
      ],
    ];

    pieces['Z'] = [
      [ 
        [1,1,0],
        [0,1,1],
        [0,0,0],
      ],
      [ 
        [0,0,1],
        [0,1,1],
        [0,1,0],
      ],
      [ 
        [0,0,0],
        [1,1,0],
        [0,1,1],
      ],
      [ 
        [0,1,0],
        [1,1,0],
        [1,0,0],
      ],
    ];

    pieces['L'] = [
      [ 
        [0,0,1],
        [1,1,1],
        [0,0,0],
      ],
      [ 
        [0,1,0],
        [0,1,0],
        [0,1,1],
      ],
      [ 
        [0,0,0],
        [1,1,1],
        [1,0,0],
      ],
      [ 
        [1,1,0],
        [0,1,0],
        [0,1,0],
      ],
    ];

    pieces['J'] = [
      [ 
        [1,0,0],
        [1,1,1],
        [0,0,0],
      ],
      [ 
        [0,1,1],
        [0,1,0],
        [0,1,0],
      ],
      [ 
        [0,0,0],
        [1,1,1],
        [0,0,1],
      ],
      [ 
        [0,1,0],
        [0,1,0],
        [1,1,0],
      ],
    ];

class FieldController extends GameObject {
  constructor(props, game) {
    super(props);

    this.props = props;
    this.props.matrix = this._createMatrix(10, 24);
    this.props.matrixNext = this._createMatrix(4, 6);
    this.tab_probability = [1, 1, 1, 1, 1, 1, 1];
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
    this.audioLineTetris.volume = .5

    this.currentLevel = 1;

    this._newPiece(game);

    this.delayBlock150 = throttle((cb) => {
      cb()
    }, 120);

    this.delayBlock50 = throttle((cb) => {
      cb();
    }, 60);
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
    return pieces[type][rotate];
  }

  onEnterFrame(game) {

    if(this.isPushing) {
        this._movePiece(null, game)
        this._movePiece(null, game)
        this._movePiece(null, game)
        return;
    }

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
            this._updateScore(this.linesToBeRemoved.length, game);
            this._updateLines(this.linesToBeRemoved.length, game);
            this._updateLevel(game);
          } else {
            this.currentPixel++;
          }

        }
      }
    } else {
      const time = Date.now() / 1000;

      const gVelocity = Math.pow((0.8-((this.currentLevel-1)*0.007)),this.currentLevel-1)

      if (time > this.lastTime + gVelocity) {
        this.lastTime = time;
        this._movePiece(null, game)
      }
    }
  }

  _updateLevel(game) {
    let lines = parseInt(game.state.lines);
    let level = parseInt(game.state.level);
    const limit = 10;

    const newLevel = +(lines / limit).toString().split('.')[0];
    game.setState({level: newLevel || 1});
    this.currentLevel = newLevel;
  }

  _updateLines(linesNumber, game) {
    let lines = parseInt(game.state.lines);
    lines = lines + linesNumber;
    game.setState({lines});
  }

  _updateScore(linesNumber, game) {
    let score = parseInt(game.state.score);
    let level = parseInt(game.state.level);
    switch(linesNumber) {
      case 1:
        score += 40 * (level + 1);
        break;
      case 2:
        score += 100 * (level + 1);
        break;
      case 3:
        score += 300 * (level + 1);
        break;
      case 4:
        score += 1200 * (level + 1);
        break;
      case 10:
        score += 2 * (level + 1);
        break;
      case 15:
        score += 1 * (level + 1);
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

  _getRandom () {
    // find random number according to probability
    var rand = Math.random()*7;
    var stop = 0;
    rand -= this.tab_probability[stop];
    while (rand > 0) {
      stop++;
      if (stop > 6) {
        break;
      };
      rand -= this.tab_probability[stop];
    }
    // redistribute probability
    var to_distribute = this.tab_probability[stop] * .5;
    this.tab_probability[stop] *=  .5;
    for (var j = 0; j < 7; j++) {
      if (j != stop) {
        this.tab_probability[j] += to_distribute / 6;
      };
    }
    return stop;
  }

  _validateLineScore() {
    let lines = [];
    for (let i = 0, l = 24; i < l; i++) {
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
    const piece = game.state.currentPiece;
    const p = this._getPiece(piece);
    const { down } = game.state.control;

    for (let i = 0, l = p.length; i < l; i++) {
      for (let j = 0, l2 = p[i].length; j < l2; j++) {
        if(p[i][j] > 0) {
          // matrix[piece.y + i][piece.x + j] = { filled: 1, type: piece.type}

          if (!this.props.matrix[piece.y + i]) {
            return 'out-down';
          }

          if (!this.props.matrix[piece.y + i][piece.x + j]) {
            return 'out-wall';
          }

          if (this.props.matrix[piece.y + i][piece.x + j].filled > 0 && down) {
            return 'colision';
          }

          if (this.props.matrix[piece.y + i][piece.x + j].filled > 0 && !down) {
            return 'out';
          }
        }
      }
    }

    return 'bypass'
  }

  _removeFromMatrix(piece, matrix = this.props.matrix) {
    const p = this._getPiece(piece);
    for (let i = 0, l = p.length; i < l; i++) {
      for (let j = 0, l2 = p[i].length; j < l2; j++) {
        if(p[i][j] > 0) {
          matrix[piece.y + i][piece.x + j] = { filled: 0 };
        }
      }
    }
  }
  _pushToMatrix(piece, matrix = this.props.matrix) {
    const p = this._getPiece(piece);
    for (let i = 0, l = p.length; i < l; i++) {
      for (let j = 0, l2 = p[i].length; j < l2; j++) {
        if(p[i][j] > 0) {
          matrix[piece.y + i][piece.x + j] = { filled: 1, type: piece.type}
        }
      }
    }
  }

  onKeyDown(keys, game) {
    if(keys.isPressed) {
      this._movePiece(keys, game);
    }
  }

  _randomPiece() {
    return { type: this.types[this._getRandom()], rotate: 0, x: 0, y: 0 };
  }

  _handleNextPiece(game) {
    this.nextPiece = this.nextPiece || this._randomPiece();
    const piece = this.nextPiece;


    this.nextPiece.x = 1;
    this.nextPiece.y = 1;

    this._removeFromMatrix(this.nextPiece, this.props.matrixNext);

    this.nextPiece = this._randomPiece();

    this.nextPiece.x = 1;
    this.nextPiece.y = 1;

    this._pushToMatrix(this.nextPiece, this.props.matrixNext);

    piece.x = 4;
    piece.y = 1;

    game.setState({
      currentPiece: piece,
      oldCurrentPiecePosition: piece,
      matrixNext: Object.assign(this.props.matrixNext),
      matrix: Object.assign(this.props.matrix)
    });
  }

  _newPiece(game) {
    if(this.isPushing) {
      this.isPushing = false;
    }

    this._handleNextPiece(game);

    const validateResult = this._validate(game);

    if (validateResult === 'colision') {
      this.paused = true;
      console.log(`gameover`);
      return
    }

    // this._pushToMatrix(game.state.currentPiece);
    // this._updateGameMatrix()
  }

  _updateGameMatrix() {
    game.setState({
      matrix: Object.assign(this.props.matrix)
    });
  }

  _movePiece(keys, game) {
    if (this.paused) return false;

    let {y, x, rotate, type} = game.state.currentPiece;
    const oldCurrentPiecePosition = game.state.currentPiece;
    type = type || this.types[getRandom(0)];
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

        // down or j
        if (keys[74] || keys[40]) {
          y = y + 1;
          this._updateScore(15, game);
          down = true;
          return;
        }

      });
      this.delayBlock150(() => {
        // up
        if (keys[38] || keys[75]) {
            rotate = rotate === 3 ? 0 : rotate + 1;
            audio = this.audioRotate;
        }
          // space
          if (keys[32]) {
            // y = y + 1;
            this.isPushing = true;
            down = true;
            return;
          }
        });
    } else {
        const velocity = this.isPushing ? 1 : 1;
        y = y + velocity;
        down = true;
        audio = null;
        if(this.isPushing) {
          this._updateScore(10, game)
        }
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
      // matrix: Object.assign(this.props.matrix)
    });

    this._removeFromMatrix(game.state.oldCurrentPiecePosition);

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

    if (validateResult === 'out-wall') {
      // Brings back the piece to the viewport on the rotate or moving
      do {
        x = x > this.props.matrix[0].length / 2 ? x - 1 : x + 1;

        game.setState({
          currentPiece: { type, rotate, x, y },
        });
      }
      while(this._validate(game) === 'out-wall');


      this._pushToMatrix(game.state.currentPiece);

      game.setState({
        matrix: Object.assign(this.props.matrix)
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

  }
}
