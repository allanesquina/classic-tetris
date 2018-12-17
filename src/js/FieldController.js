import Game from './engine/GameEngine';
import { throttle } from './engine/Utils';
import  SingleAudioSrc from '../assets/audio/single.ogg';
import  DoubleAudioSrc from '../assets/audio/double.ogg';
import  TripleAudioSrc from '../assets/audio/triple.ogg';
import  TetrisAudioSrc from '../assets/audio/tetris.ogg';
import  DropAudioSrc from '../assets/audio/drop.ogg';
import  MoveAudioSrc from '../assets/audio/move.wav';
import  RotateAudioSrc from '../assets/audio/rotate.wav';
import pieces from './pieces';
import { config } from './gameConfig';
import {
  PIECES_SPRITE_COLORS,
  PIECES_TYPES,
 } from './enum';

  var piecesImages =  new Map();

  function getNextPieceImage(type, game) {
    const image = piecesImages.get(`${type}-${config.theme.className}`);
    if(!image) {
      console.log('creating', type)
      const tmpImage = createNextPieceImage(game.state.matrixNext);
      piecesImages.set(`${type}-${config.theme.className}`, tmpImage);
      return tmpImage;
    }

    return image;
  }

  function createNextPieceImage(matrix) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    let sprite =  new Image();
    sprite.src = config.theme.sprite.spriteSheet;

    let spriteSize = config.theme.sprite.size;
    let pw = spriteSize * config.theme.sprite.scale;
    let border = config.theme.sprite.border;
    let sx = 0;
    const imageHeight = matrix.length * (pw + border);
    const imageWidth = matrix[0].length * (pw + border);
    let pos;

    canvas.width = imageWidth;
    canvas.height = imageHeight;

    for (let i = 0, l = config.matrixNext.height; i < l; i++) {
      for (let j = 0, y = config.matrixNext.width; j < y; j++) {

        if (matrix[i] && matrix[i][j]) {
          pos = matrix[i][j];
          switch (config.theme.sprite.type) {
            case 'rect':
              ctx.fillStyle = pos.filled > 0 ? config.theme.color.filled : 'rgba(0,0,0,0)';
              ctx.fillRect((j * (pw + border)), (i * (pw + border)), pw, pw);
              break;
            case 'sprite':
              sx = pos.filled > 0 ? PIECES_SPRITE_COLORS[pos.type] : PIECES_SPRITE_COLORS['black'];
              ctx.drawImage(
                sprite,
                sx, 0, spriteSize, spriteSize,
                (j * (pw + border)), (i * (pw + border)),
                pw, pw 
              );
            break;
          default:
        }

    }
      }
    }
    
    return canvas.toDataURL();
  }



  export default class FieldController extends Game.GameObject {
  constructor(props) {
    super(props);

    this.props = props;
    this.interval = null;
    this.audioRotate = new Audio(RotateAudioSrc);
    this.audioMove = new Audio(MoveAudioSrc);
    this.audioDrop = new Audio(DropAudioSrc);
    this.audioLineSingle = new Audio(SingleAudioSrc);
    this.audioLineDouble = new Audio(DoubleAudioSrc);
    this.audioLineTriple = new Audio(TripleAudioSrc);
    this.audioLineTetris = new Audio(TetrisAudioSrc);
    this.audioRotate.volume = .4;
    this.audioMove.volume = .2;
    this.audioDrop.volume = .5;
    this.audioLineSingle.volume = .5;
    this.audioLineDouble.volume = .5;
    this.audioLineTriple.volume = .5;
    this.audioLineTetris.volume = .5

    this.animationCount = 0;

    this.delayBlock150 = throttle((cb) => {
      cb()
    }, 180);

    this.delayBlock50 = throttle((cb) => {
      cb();
    }, 180);

  }

  onInit(game) {
    this._reset(game);

    this.resetEventOff = game.event.on('reset', () => {
      this._reset(game);
    })
  }
  onDestroy() {
    console.log('destroying controller')
    this.resetEventOff();
  }

  _reset(game) {
    this.props.matrix = this._createMatrix(config.matrix.width, config.matrix.height);
    this.props.matrixNext = this._createMatrix(config.matrixNext.width, config.matrixNext.height);
    this.linesCount = 0;
    this.currentLevel = 1;
    this.tab_probability = [1, 1, 1, 1, 1, 1, 1];
    game.setState({score: 0});
    this._newPiece(game);
    this.paused = false;
    // PIECES_TYPES.forEach((p, index) => {
    //   console.log(p)
    //   const matrix = this._createMatrix(config.matrixNext.width, config.matrixNext.height);
    //   const piece =  this._createPiece(index);
    //   this._pushToMatrix(piece, matrix);
    //   getNextPieceImage(matrix, game);
    //   console.table(matrix)
    // })
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

  _test(game) {
    let startPoint = this.linesToBeRemovedTmp[this.linesToBeRemovedTmp.length-1];

    startPoint = startPoint + this.animationCount;

    while(startPoint--) {
      const row = config.matrix.width;
      for ( let i = 0, l = row; i < row; i++) {
        const obj = game.object.get(`Piece-${startPoint}-${i}`);
        if(obj) {
          obj.props.y = obj.props.y + 2;
        }
      }
    }
  }

  _setMatrixReferenceOnPixel(game) {
    let startPoint = this.linesToBeRemovedTmp[this.linesToBeRemovedTmp.length-1];

    startPoint = startPoint + this.animationCount;

    while(startPoint--) {
      const row = config.matrix.width;
      for ( let i = 0, l = row; i < row; i++) {
        const obj = game.object.get(`Piece-${startPoint}-${i}`);
        if(obj) {
          obj.props.refY = obj.props.refY + 1;
          game.object.changeId(obj, `Piece-${obj.props.refY}-${i}`)
        }
      }
    }
  }

  _removeLineFromCanvas(line, game) {
      for( let i = 0, l =  config.matrix.width; i < l; i++) {
        let obj = game.object.get(`Piece-${line}-${i}`);
        if(obj) {
          obj.props.y = -((config.theme.sprite.size * config.theme.sprite.scale) + config.theme.sprite.border);
          // obj.props.y = 0;
          obj.props.refY = 1;
          game.object.changeId(obj, `Piece-1-${i}`)
        }
      }
  }

  onEnterFrame(game) {
    if(this.isPushing) {
      this._push(game, true);
      this.isPushing = false;
    }

    if (this.paused) {

      // --START LOOP 
      // - remove current line from canvas
      // - animate pixels till the new position 
      // - reset height to be animated
      // - remove current line from matrix
      // - change the reference on the piexls
      // - change the pixel ID for the new reference
      // - remove last line from the `lines to be removed` array
      // - incrise animationCount
      // --END LOOP 

      if(this.isRepositionMatrixAnimation) {
        const time = Date.now() / 1000;
        if (time > this.lastTime + 0) {

          this.lastTime = time;
           // For each line to be removed
          if(this.linesToBeRemovedTmp.length > 0) {
            this.paused = true;

            // Height for each pixel move down 
            if(this.lineHeightToBeRepositioned > 0) {
              // Call reorder
              this._test(game);

              // Decrise hight
              this.lineHeightToBeRepositioned--;
            }
            // Go to the next line
            else {
              // Reset hight
              this.lineHeightToBeRepositioned = ((config.theme.sprite.size * config.theme.sprite.scale) + config.theme.sprite.border) / 2;

              // Remove the current line from matrix
              this._removeLinesFromMatrixExp(this.linesToBeRemovedTmp[this.linesToBeRemovedTmp.length - 1] + this.animationCount);

              // Rearange matrix references from pixel
              this._setMatrixReferenceOnPixel(game);

              // Remove last line from tmp array
              const line = this.linesToBeRemovedTmp.pop();
              
              // Incrise animationCount
              this.animationCount = this.animationCount + 1;

              // Remove the next last line from canvas
              this._removeLineFromCanvas(this.linesToBeRemovedTmp[this.linesToBeRemovedTmp.length - 1] + this.animationCount, game);
            }
          } 
            // If there are no more lines to remove
          else {
            // Stop animation
            this.isRepositionMatrixAnimation = false;

            // Run the game
            this.paused = false;
          }
        }
      } 

      if (this.isRemovingLines) {
        const time = Date.now() / 1000;
        if (time > this.lastTime + 0.005) {
          this.lastTime = time;

          this.currentPixel = this.currentPixel > 0 ? this.currentPixel : 0;
          this._walkThroughLinesToBeRemoved(this.currentPixel);

          if (this.currentPixel === config.matrix.width + 1) {
            this.currentPixel = 0;
            this.isRemovingLines = false;
            this._updateScore(this.linesToBeRemoved.length, game);
            this._updateLines(this.linesToBeRemoved.length, game);


            // Animation to down
            this.isRepositionMatrixAnimation = true;
            this.lineHeightToBeRepositioned = ((config.theme.sprite.size * config.theme.sprite.scale) + config.theme.sprite.border) / 2;
            this.linesToBeRemovedTmp = this.linesToBeRemoved.concat();
            this.animationCount = 0;
            // Remove the last line from canvas
            this._removeLineFromCanvas(this.linesToBeRemovedTmp[this.linesToBeRemovedTmp.length - 1], game);

          } else {
            this.currentPixel++;
          }

        }
      }
    } else {
      const gVelocity = Math.pow((0.8-((this.currentLevel-1)*0.007)),this.currentLevel-1)
      const time = Date.now() / 1000;
      if (time > this.lastTime + gVelocity) {
        this.lastTime = time;
        this._movePiece(null, game)
      }
    }
  }

  _walkThroughLinesToBeRemoved(pixel) {
    for (let i = 0, l = this.linesToBeRemoved.length; i < l; i++) {
      pixel = (i + 1) % 2 === 1 ? config.matrix.width - pixel : pixel;
      this._emptyPixelFromLine(pixel, this.props.matrix[this.linesToBeRemoved[i]]);
    }
  }

  _emptyPixelFromLine(pixel, line) {
    if (line[pixel]) {
      line[pixel].filled = 0;
      delete line[pixel].type;
    }
  }

  _updateLevel(game) {
    let level = parseInt(game.state.level);
    game.setState({level: level + 1});
    this.currentLevel = level + 1; 
  }

  _updateLines(linesNumber, game) {
    this.linesCount += linesNumber;
    if(this.linesCount >= config.skipLevelAt) {
      this.linesCount = this.linesCount - config.skipLevelAt;
      this._updateLevel(game);
    }
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
    game.event.emit('score', score)

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
    for (let i = 0, l = config.matrix.height; i < l; i++) {
      let line = 0;
      for (var j = 0, y = config.matrix.width; j < y; j++) {
        line = this.props.matrix[i][j].filled > 0 ? line + 1 : line;
      }

      // Save the line that has all pieces filled
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

  _removeLinesFromMatrixExp(line) {
    let rest = this.props.matrix.splice(line, 1);
    this.props.matrix.unshift(this._emptyAllPixelsFromLine(rest));
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
    return this._createPiece(this._getRandom());
  }

  _createPiece(type) {
    return { type: PIECES_TYPES[type], rotate: 0, x: 0, y: 0 };
  }

  _handleNextPiece(game) {
    this.nextPiece = this.nextPiece || this._randomPiece();
    const piece = this.nextPiece;

    this._removeFromMatrix(this.nextPiece, this.props.matrixNext);
    this.nextPiece = this._randomPiece();
    this._pushToMatrix(this.nextPiece, this.props.matrixNext);

    piece.x = parseInt(config.matrix.width / 2);
    piece.y = 1;

    game.setState({
      currentPiece: piece,
      oldCurrentPiecePosition: piece,
      matrixNext: Object.assign(this.props.matrixNext),
      matrix: Object.assign(this.props.matrix)
    });

    game.event.emit('nextPiece',  getNextPieceImage(this.nextPiece.type, game), this.nextPiece.type);

    // Emit new piece when the theme is changed
    game.event.on('theme', () => {
      game.event.emit('nextPiece',  getNextPieceImage(this.nextPiece.type, game), this.nextPiece.type);
    })
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
      game.event.emit('gameover');
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
    type = type || PIECES_TYPES[getRandom(0)];
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
        // up
        if (keys[38]) {
            rotate = rotate === 3 ? 0 : rotate + 1;
            audio = this.audioRotate;
        }
      this.delayBlock150(() => {
        // up
        if (keys[75]) {
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
        y = y + 1
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
        x = x > parseInt(config.matrix.width / 2) ? x - 1 : x + 1;

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

  _push(game, remove) {

    let {y, x, rotate, type} = game.state.currentPiece;
    const oldCurrentPiecePosition = game.state.currentPiece;
    let down = true;

    if(remove) {
      this._removeFromMatrix(oldCurrentPiecePosition);
    }

    y = y + 1
    game.setState({
      control: { down },
      currentPiece: { type, rotate, x, y },
    });


    if(this._validate(game) != 'out-down' && this._validate(game) != 'colision') {
      game.setState({
        control: { down },
        currentPiece: { type, rotate, x, y },
      });
      this._push(game);
      return;
    }

    this._pushToMatrix(oldCurrentPiecePosition);
    this._validateScore();
    this._newPiece(game);
    this.audioDrop.currentTime = 0;
    this.audioDrop.play();
    this.isPushing = false;
  }
}
